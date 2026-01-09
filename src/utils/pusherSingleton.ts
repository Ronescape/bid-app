import Pusher from 'pusher-js';
import { getEnv } from './GeneralUtility';

const PUSHER_KEY = getEnv("VITE_PUSHER_APP_KEY");
const PUSHER_CLUSTER = getEnv("VITE_PUSHER_CLUSTER");

class PusherSingleton {
  private static instance: PusherSingleton;
  private pusher: Pusher | null = null;
  private channels: Map<string, any> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();
  private isInitializing = false;
  private debugMode = process.env.NODE_ENV === 'development';

  private constructor() {}

  static getInstance(): PusherSingleton {
    if (!PusherSingleton.instance) {
      PusherSingleton.instance = new PusherSingleton();
    }
    return PusherSingleton.instance;
  }

  initialize(): Pusher | null {
    if (this.pusher) {
      this.debugLog("Pusher already initialized");
      return this.pusher;
    }

    if (this.isInitializing) {
      this.debugLog("Pusher initialization already in progress");
      return null;
    }

    if (!PUSHER_KEY) {
      console.warn("Pusher app key not configured");
      return null;
    }

    this.debugLog("Initializing Pusher singleton");
    this.isInitializing = true;

    try {
      this.pusher = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER || 'mt1',
        forceTLS: true,
        enabledTransports: ["ws", "wss"],
        activityTimeout: 120000,
        pongTimeout: 30000,
        disableStats: true,
        authEndpoint: '/broadcasting/auth',
        auth: {
          headers: {
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          }
        }
      });

      // Enhanced connection event logging
      this.pusher.connection.bind('error', (err: any) => {
        console.error("🚨 Pusher connection error:", err);
        this.isInitializing = false;
      });

      this.pusher.connection.bind('connecting', () => {
        this.debugLog("🔄 Pusher connecting...");
      });

      this.pusher.connection.bind('connected', () => {
        this.debugLog("✅ Pusher connected successfully");
        this.isInitializing = false;
      });

      this.pusher.connection.bind('disconnected', () => {
        this.debugLog("❌ Pusher disconnected");
        this.isInitializing = false;
      });

      this.pusher.connection.bind('state_change', (states: any) => {
        this.debugLog(`🔄 Pusher state changed: ${states.previous} -> ${states.current}`);
      });

      return this.pusher;
    } catch (error) {
      console.error("🚨 Error initializing Pusher:", error);
      this.isInitializing = false;
      return null;
    }
  }

  subscribeToUserChannel(userId: string | number, eventCallback: (payload: any) => void) {
    if (!this.pusher) {
      console.error("Pusher not initialized, cannot subscribe");
      return null;
    }

    const channelName = `staging.user.${userId}`;
    this.debugLog(`Subscribing to channel: ${channelName}`);

    let channel = this.channels.get(channelName);
    
    // If channel doesn't exist or isn't subscribed, create it
    if (!channel || !channel.subscribed) {
      if (channel) {
        this.debugLog(`Cleaning up old channel: ${channelName}`);
        channel.unbind_all();
        this.channels.delete(channelName);
      }
      
      this.debugLog(`Creating new subscription to: ${channelName}`);
      channel = this.pusher.subscribe(channelName);
      this.channels.set(channelName, channel);

      // Enhanced subscription event handling
      channel.bind("pusher:subscription_succeeded", () => {
        this.debugLog(`✅ Successfully subscribed to ${channelName}`);
        
        // Bind existing callbacks for topup.status.update
        const listenerKey = `${channelName}_topup.status.update`;
        const callbacks = this.eventListeners.get(listenerKey) || [];
        
        callbacks.forEach(callback => {
          if (typeof callback === 'function') {
            channel.bind("topup.status.update", callback);
            this.debugLog(`Bound callback to topup.status.update for ${channelName}`);
          }
        });
      });

      channel.bind("pusher:subscription_error", (error: any) => {
        console.error(`❌ Failed to subscribe to ${channelName}:`, error);
      });

      // Bind to all channel events for debugging
      if (this.debugMode) {
        channel.bind_global((eventName: string, data: any) => {
          this.debugLog(`📨 Channel ${channelName} event: ${eventName}`, data);
        });
      }
    } else {
      this.debugLog(`Already subscribed to ${channelName}, reusing channel`);
    }

    // Store the callback
    const listenerKey = `${channelName}_topup.status.update`;
    if (!this.eventListeners.has(listenerKey)) {
      this.eventListeners.set(listenerKey, []);
    }
    
    const callbacks = this.eventListeners.get(listenerKey)!;
    if (!callbacks.includes(eventCallback)) {
      callbacks.push(eventCallback);
      
      // If channel is already subscribed, bind the callback immediately
      if (channel.subscribed) {
        channel.bind("topup.status.update", eventCallback);
        this.debugLog(`Immediately bound callback to topup.status.update for ${channelName}`);
      } else {
        this.debugLog(`Channel ${channelName} not yet subscribed, callback queued`);
      }
    } else {
      this.debugLog(`Callback already registered for ${channelName}`);
    }

    return channel;
  }

  unsubscribeFromChannel(channelName: string, eventCallback: (payload: any) => void) {
    const listenerKey = `${channelName}_topup.status.update`;
    const callbacks = this.eventListeners.get(listenerKey);
    
    if (callbacks) {
      const index = callbacks.indexOf(eventCallback);
      if (index > -1) {
        callbacks.splice(index, 1);
        
        // If channel exists, unbind the specific callback
        const channel = this.channels.get(channelName);
        if (channel && channel.subscribed) {
          channel.unbind("topup.status.update", eventCallback);
          this.debugLog(`Unbound callback from ${channelName}`);
        }
        
        // If no more callbacks, consider unsubscribing
        if (callbacks.length === 0) {
          this.debugLog(`No more listeners for ${channelName}, keeping channel subscribed`);
        }
      }
    }
  }

  disconnect() {
    if (this.pusher) {
      this.debugLog("Disconnecting Pusher singleton");
      this.channels.forEach((channel, channelName) => {
        channel.unbind_all();
        channel.unsubscribe();
        this.debugLog(`Unsubscribed from ${channelName}`);
      });
      this.channels.clear();
      this.eventListeners.clear();
      this.pusher.disconnect();
      this.pusher = null;
    }
  }

  isConnected(): boolean {
    return this.pusher?.connection.state === 'connected';
  }

  getConnectionState(): string {
    return this.pusher?.connection.state || 'not_initialized';
  }

  getAllChannels(): string[] {
    return Array.from(this.channels.keys());
  }

  // Debug logging helper
  private debugLog(message: string, data?: any) {
    if (this.debugMode) {
      console.log(`[PusherSingleton] ${message}`, data || '');
    }
  }

  // Method to manually trigger a test event (for development)
  triggerTestEvent(channelName: string, eventName: string, data: any) {
    if (!this.debugMode) {
      console.warn("Test events only available in development mode");
      return;
    }
    
    const channel = this.channels.get(channelName);
    if (channel && channel.trigger) {
      this.debugLog(`Triggering test event on ${channelName}: ${eventName}`, data);
      channel.trigger(eventName, data);
    } else {
      console.warn(`Channel ${channelName} not found or cannot trigger events`);
    }
  }
}

export const pusherSingleton = PusherSingleton.getInstance();