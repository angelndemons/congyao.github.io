// In-memory storage for spam logs (in production, use a database)
let spamLogs: Array<{
  timestamp: string;
  ip: string;
  spamScore?: number;
  reason: string;
  name: string;
  email: string;
  message: string;
}> = [];

// Function to add spam log (called from contact route)
export function addSpamLog(data: {
  ip: string;
  spamScore?: number;
  reason: string;
  name: string;
  email: string;
  message: string;
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

// Function to get spam logs
export function getSpamLogs() {
  return {
    totalSpamAttempts: spamLogs.length,
    recentSpam: spamLogs.slice(-20), // Last 20 attempts
    allSpam: spamLogs
  };
}

// Function to clear spam logs
export function clearSpamLogs() {
  spamLogs = [];
}
