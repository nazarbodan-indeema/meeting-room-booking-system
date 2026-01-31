import { NextResponse } from 'next/server';
import { processNoShows } from '@/lib/actions/analytics';

/**
 * Vercel Cron Job endpoint to automatically cancel no-show bookings.
 * Should be called every 10 minutes.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');

  // Basic security for the cron task (Vercel passes a secret)
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const result = await processNoShows();
    return NextResponse.json({
      success: true,
      processed: result.count,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
