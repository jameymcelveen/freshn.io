import {NextResponse} from 'next/server';
import {WorkstationState} from '@freshn/types';

export async function POST(request: Request) {
  try {

    const apiKey = request.headers.get('x-freshn-key');

    if (apiKey !== process.env.FRESHN_API_KEY) {
      return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }
    const data: WorkstationState = await request.json();

    console.log(`🌿 Received heartbeat from ${data.hostname} (${data.os})`);

    return NextResponse.json({
      success: true,
      message: `System ${data.hostname} synchronized.`
    });
  } catch (error) {
    return NextResponse.json({success: false, error: 'Invalid payload'}, {status: 400});
  }
}
