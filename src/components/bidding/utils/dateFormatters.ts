export function getTimeRemaining(endDate: Date): string {
  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();
  
  if (diffMs <= 0) return "Ended";
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h`;
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m ${diffSeconds}s`;
  } else {
    return `${diffSeconds}s`;
  }
}


export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getTimeUntilStart(startDate: Date): string {
  const now = new Date();
  const diffMs = startDate.getTime() - now.getTime();
  
  if (diffMs <= 0) return "Starting soon";
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  if (diffDays > 0) {
    return `Starts in ${diffDays}d ${diffHours}h`;
  } else if (diffHours > 0) {
    return `Starts in ${diffHours}h ${diffMinutes}m`;
  } else if (diffMinutes > 0) {
    return `Starts in ${diffMinutes}m ${diffSeconds}s`;
  } else {
    return `Starts in ${diffSeconds}s`;
  }
}

// In dateFormatters.ts
export function getTimeRemainingWithSeconds(endDate: Date): string {
  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();
  
  if (diffMs <= 0) return "Ended";
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h ${diffMinutes}m`;
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m ${diffSeconds}s`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m ${diffSeconds}s`;
  } else {
    return `${diffSeconds}s`;
  }
}

export function getTimeUntilStartWithSeconds(startDate: Date): string {
  const now = new Date();
  const diffMs = startDate.getTime() - now.getTime();
  
  if (diffMs <= 0) return "Starting now";
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  if (diffDays > 0) {
    return `Starts in ${diffDays}d ${diffHours}h`;
  } else if (diffHours > 0) {
    return `Starts in ${diffHours}h ${diffMinutes}m`;
  } else if (diffMinutes > 0) {
    return `Starts in ${diffMinutes}m ${diffSeconds}s`;
  } else {
    return `Starts in ${diffSeconds}s`;
  }
}