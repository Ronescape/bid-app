export const getTimeRemaining = (endDate: Date) => {
  const diff = endDate.getTime() - Date.now();
  if (diff <= 0) return "Ended";

  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);

  return hours > 24
    ? `${Math.floor(hours / 24)}d ${hours % 24}h`
    : `${hours}h ${minutes}m`;
};

export const getTimeUntilStart = (startDate: Date) => {
  const diff = startDate.getTime() - Date.now();
  if (diff <= 0) return "Starting soon";

  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);

  return days > 0 ? `Starts in ${days}d ${hours}h` : `Starts in ${hours}h`;
};
