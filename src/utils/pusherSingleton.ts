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

  private constructor() {}

  static getInstance(): PusherSingleton {
    if (!PusherSingleton.instance) {
      PusherSingleton.instance = new PusherSingleton();
    }
    return PusherSingleton.instance;
  }

  initialize(): Pusher | null {
    if (this.pusher) {
      console.log("Pusher already initialized");
      return this.pusher;
    }

    if (this.isInitializing) {
      console.log("Pusher initialization already in progress");
      return null;
    }

    if (!PUSHER_KEY) {
      console.warn("Pusher app key not configured");
      return null;
    }

    console.log("Initializing Pusher singleton");
    this.isInitializing = true;

    try {
      this.pusher = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
        forceTLS: true,
        enabledTransports: ["ws", "wss"],
        activityTimeout: 120000,
        pongTimeout: 30000,
        disableStats: true, // Disable stats to reduce overhead
      });

      this.pusher.connection.bind('error', (err: any) => {
        console.error("Pusher connection error:", err);
        this.isInitializing = false;
      });

      this.pusher.connection.bind('connected', () => {
        console.log("Pusher connected");
        this.isInitializing = false;
      });

      this.pusher.connection.bind('disconnected', () => {
        console.log("Pusher disconnected");
        this.isInitializing = false;
      });

      return this.pusher;
    } catch (error) {
      console.error("Error initializing Pusher:", error);
      this.isInitializing = false;
      return null;
    }
  }

  subscribeToUserChannel(userId: string | number, eventCallback: (payload: any) => void) {
    if (!this.pusher) {
      console.error("Pusher not initialized");
      return;
    }

    const channelName = `staging.user.${userId}`;
    console.log(`Setting up subscription to channel: ${channelName}`);

    let channel = this.channels.get(channelName);
    
    // If channel doesn't exist or isn't subscribed, create it
    if (!channel || !channel.subscribed) {
      if (channel) {
        console.log(`Cleaning up old channel: ${channelName}`);
        channel.unbind_all();
        this.channels.delete(channelName);
      }
      
      console.log(`Subscribing to new channel: ${channelName}`);
      channel = this.pusher.subscribe(channelName);
      this.channels.set(channelName, channel);

      channel.bind("pusher:subscription_succeeded", () => {
        console.log(`✅ Successfully subscribed to ${channelName}`);
        // Bind existing callbacks
        const listenerKey = `${channelName}_topup.status.update`;
        const callbacks = this.eventListeners.get(listenerKey) || [];
        callbacks.forEach(callback => {
          channel.bind("topup.status.update", callback);
        });
      });

      channel.bind("pusher:subscription_error", (error: any) => {
        console.error(`❌ Failed to subscribe to ${channelName}:`, error);
      });
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
      }
    }
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
        }
        
        // If no more callbacks, consider unsubscribing
        if (callbacks.length === 0) {
          console.log(`No more listeners for ${channelName}, keeping channel subscribed`);
          // We keep the channel subscribed in case new listeners are added
        }
      }
    }
  }

  disconnect() {
    if (this.pusher) {
      console.log("Disconnecting Pusher singleton");
      this.channels.forEach((channel, channelName) => {
        channel.unbind_all();
        channel.unsubscribe();
        console.log(`Unsubscribed from ${channelName}`);
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
}

export const pusherSingleton = PusherSingleton.getInstance();