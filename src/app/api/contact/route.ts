import { NextResponse } from 'next/server';
// it doesn't work LMAO
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    console.log('Received message:', { name, email, message });

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 