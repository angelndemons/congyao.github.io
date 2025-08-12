import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getSpamLogs, clearSpamLogs } from '../../lib/spam-logger';

// GET endpoint to view spam logs
export async function GET(request: NextRequest) {
  // Simple password protection (you can change this password)
  const url = new URL(request.url);
  const password = url.searchParams.get('password');
  
  if (password !== '19821123Y@oc') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return NextResponse.json(getSpamLogs());
}

// POST endpoint to clear logs
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const password = url.searchParams.get('password');
  
  if (password !== '19821123Y@oc') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const { action } = await request.json();
  
  if (action === 'clear') {
    clearSpamLogs();
    return NextResponse.json({ message: 'Logs cleared' });
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
