import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Contact form submission started');
    
    const { name, email, message } = await request.json();
    console.log('Form data received:', { name, email, messageLength: message?.length });

    // Validate input
    if (!name || !email || !message) {
      console.log('Validation failed - missing fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if we have Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    console.log('RESEND_API_KEY found, attempting to send email');

    // Use Resend API
    const emailData = {
      from: 'onboarding@resend.dev',
      to: ['cong.yao.main@gmail.com'],
      subject: `New Question for Cong from ${name}`,
      html: `
        <h2>New Question for Cong!</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Question:</strong></p>
        <p>${message}</p>
      `,
    };

    console.log('Sending email with data:', {
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject
    });

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    console.log('Resend API response status:', resendResponse.status);

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend API error:', {
        status: resendResponse.status,
        statusText: resendResponse.statusText,
        errorData: errorData
      });
      return NextResponse.json(
        { error: `Email service error: ${resendResponse.status} - ${errorData}` },
        { status: 500 }
      );
    }

    const result = await resendResponse.json();
    console.log('Email sent successfully:', result);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
