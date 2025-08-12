import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

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

// GET endpoint to view spam logs
export async function GET(request: NextRequest) {
  // Simple password protection (you can change this password)
  const url = new URL(request.url);
  const password = url.searchParams.get('password');
  
  if (password !== 'congyao2024') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return NextResponse.json({
    totalSpamAttempts: spamLogs.length,
    recentSpam: spamLogs.slice(-20), // Last 20 attempts
    allSpam: spamLogs
  });
}

// POST endpoint to clear logs
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const password = url.searchParams.get('password');
  
  if (password !== 'congyao2024') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const { action } = await request.json();
  
  if (action === 'clear') {
    spamLogs = [];
    return NextResponse.json({ message: 'Logs cleared' });
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
