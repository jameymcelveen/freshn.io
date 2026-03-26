import { NextResponse } from 'next/server';
import { WorkstationState } from '@freshn/types';

export async function POST(request: Request) {
    try {
        const data: WorkstationState = await request.json();

        // 💡 This is where you'll eventually add Firebase:
        // await db.collection('workstations').doc(data.hostname).set(data);

        console.log(`🌿 Received heartbeat from ${data.hostname} (${data.os})`);

        return NextResponse.json({
            success: true,
            message: `System ${data.hostname} synchronized.`
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }
}