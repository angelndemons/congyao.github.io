// In-memory storage for spam logs (in production, use a database)
let spamLogs: Array<{
  timestamp: string;
  ip: string;
  spamScore?: number;
  reason: string;
  name: string;
  email: string;
  message: string;
  wasSent: boolean; // Track if email was actually sent
}> = [];

// Function to add spam log (called from contact route)
export function addSpamLog(data: {
  ip: string;
  spamScore?: number;
  reason: string;
  name: string;
  email: string;
  message: string;
  wasSent: boolean;
}) {
  spamLogs.push({
    timestamp: new Date().toISOString(),
    ...data
  });
  
  // Keep only last 100 entries to prevent memory issues
  if (spamLogs.length > 100) {
    spamLogs = spamLogs.slice(-100);
  }
}

// Function to get daily email count (sent emails only)
export function getDailyEmailCount(): number {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  return spamLogs.filter(log => 
    log.wasSent && 
    log.timestamp.startsWith(today)
  ).length;
}

// Function to check if daily limit is reached
export function isDailyLimitReached(): boolean {
  return getDailyEmailCount() >= 50; // Back to normal limit
}

// Function to get spam logs
export function getSpamLogs() {
  const today = new Date().toISOString().split('T')[0];
  const todayLogs = spamLogs.filter(log => log.timestamp.startsWith(today));
  const sentToday = todayLogs.filter(log => log.wasSent).length;
  const filteredToday = todayLogs.filter(log => !log.wasSent).length;
  
  return {
    totalSpamAttempts: spamLogs.length,
    recentSpam: spamLogs.slice(-20), // Last 20 attempts
    allSpam: spamLogs,
    dailyStats: {
      date: today,
      sentToday,
      filteredToday,
      totalToday: todayLogs.length,
      limitReached: isDailyLimitReached(),
      limit: 50 // Back to normal limit
    }
  };
}

// Function to clear spam logs
export function clearSpamLogs() {
  spamLogs = [];
}
