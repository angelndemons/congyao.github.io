import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use Resend (recommended for Vercel) or fallback to nodemailer
    if (process.env.RESEND_API_KEY) {
      // Option 1: Resend (recommended for Vercel)
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      });

      if (!resendResponse.ok) {
        const errorData = await resendResponse.text();
        console.error('Resend API error:', errorData);
        throw new Error(`Failed to send email via Resend: ${resendResponse.status}`);
      }

      return NextResponse.json(
        { message: 'Email sent successfully' },
        { status: 200 }
      );
    } else {
      // Option 2: Fallback to nodemailer (for local development)
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.default.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'cong.yao.main@gmail.com',
        subject: `New Question for Cong from ${name}`,
        html: `
          <h2>New Question for Cong!</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Question:</strong></p>
          <p>${message}</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      return NextResponse.json(
        { message: 'Email sent successfully' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
