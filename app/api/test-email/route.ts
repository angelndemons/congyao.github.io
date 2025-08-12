import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY not found' },
        { status: 500 }
      );
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev', // Resend's default sender
        to: ['congyao@bu.edu'], // Your verified email
        subject: 'Test Email from Cong Yao Website',
        html: `
          <h2>This is a test email</h2>
          <p>If you receive this, the email service is working!</p>
          <p><strong>Test Data:</strong></p>
          <p><strong>Name:</strong> Test User</p>
          <p><strong>Email:</strong> test@example.com</p>
          <p><strong>WeChat ID:</strong> test_wechat_id</p>
          <p><strong>Question:</strong> This is a test question to verify the email service is working properly.</p>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      return NextResponse.json(
        { error: `Resend API error: ${resendResponse.status} - ${errorData}` },
        { status: 500 }
      );
    }

    const result = await resendResponse.json();
    return NextResponse.json(
      { success: true, message: 'Test email sent successfully', result },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
