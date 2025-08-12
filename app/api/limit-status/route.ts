import { NextResponse } from 'next/server';
import { isDailyLimitReached, getDailyEmailCount } from '../../lib/spam-logger';

export async function GET() {
  const dailyCount = getDailyEmailCount();
  const limitReached = isDailyLimitReached();
  
  return NextResponse.json({
    dailyCount,
    limitReached,
    limit: 50
  });
}
