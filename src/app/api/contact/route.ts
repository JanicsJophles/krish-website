import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Here you would typically integrate with an email service
    // For example, using NodeMailer, SendGrid, or similar
    console.log('Received message:', { name, email, message });

    // For now, we'll just return a success response
    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 