import { NextRequest, NextResponse } from 'next/server';
import { addSpamLog } from '../spam-log/route';

// Simple in-memory rate limiting (for production, consider Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // 5 requests per 15 minutes

  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Input sanitization function
function sanitizeInput(input: string, maxLength: number): string {
  if (!input) return '';
  // Remove HTML tags and limit length
  return input.replace(/<[^>]*>/g, '').substring(0, maxLength).trim();
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Contact form submission started');
    
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    console.log('Client IP:', ip);
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      console.log('Rate limit exceeded for IP:', ip);
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    const { name, email, wechatId, message, phone } = await request.json();
    console.log('Form data received:', { name, email, wechatId, messageLength: message?.length, hasPhone: !!phone });

    // Check honeypot field - if filled, likely a bot
    if (phone) {
      console.log('Honeypot field filled - likely a bot:', {
        ip,
        phone,
        name: name || 'unknown',
        email: email || 'unknown'
      });
      
      // Log to spam tracking system
      addSpamLog({
        ip,
        spamScore: 10, // High score for honeypot
        reason: 'Honeypot field filled',
        name: name || 'unknown',
        email: email || 'unknown',
        message: message || 'unknown'
      });
      
      // Add a small delay to make bot spam less profitable
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return success to avoid letting bots know they were detected
      return NextResponse.json(
        { message: 'Thank you!' },
        { status: 200 }
      );
    }

    // Sanitize and validate inputs
    const sanitizedName = sanitizeInput(name, 100);
    const sanitizedEmail = sanitizeInput(email, 254);
    const sanitizedWechatId = sanitizeInput(wechatId, 50);
    const sanitizedMessage = sanitizeInput(message, 5000);

    // Validate required fields
    if (!sanitizedName || !sanitizedEmail || !sanitizedMessage) {
      console.log('Validation failed - missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      console.log('Invalid email format:', sanitizedEmail);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Spam detection with scoring system
    let spamScore = 0;
    const suspiciousKeywords = [
      'casino', 'crypto', 'bitcoin', 'viagra', 'loan', 'debt', 
      'make money', 'earn money', 'investment opportunity', 'work from home',
      'get rich', 'quick cash', 'urgent', 'limited time', 'act now'
    ];
    
    const messageLower = sanitizedMessage.toLowerCase();
    const nameLower = sanitizedName.toLowerCase();
    const emailLower = sanitizedEmail.toLowerCase();
    
    // Check for suspicious keywords in message
    suspiciousKeywords.forEach(keyword => {
      if (messageLower.includes(keyword)) spamScore += 2;
    });
    
    // Check for suspicious patterns
    if (messageLower.includes('http://') || messageLower.includes('https://')) spamScore += 1;
    if (messageLower.includes('click here') || messageLower.includes('visit')) spamScore += 1;
    if (messageLower.includes('$$') || messageLower.includes('$')) spamScore += 1;
    
    // Check for suspicious email patterns
    if (emailLower.includes('temp') || emailLower.includes('test')) spamScore += 1;
    if (emailLower.match(/[0-9]{8,}/)) spamScore += 1; // Many numbers
    
    // Check for suspicious name patterns
    if (nameLower.includes('test') || nameLower.includes('admin')) spamScore += 1;
    if (nameLower.length < 2) spamScore += 1;
    
    // If spam score is high enough, log but don't send email
    if (spamScore >= 3) {
      console.log('High spam score detected - logging but not sending email:', {
        ip,
        spamScore,
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage.substring(0, 100) + '...'
      });
      
      // Log to spam tracking system
      addSpamLog({
        ip,
        spamScore,
        reason: 'High spam score',
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage
      });
      
      // Add a small delay to make spam less profitable
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return success to avoid letting spammers know they were detected
      return NextResponse.json(
        { message: 'Thank you!' },
        { status: 200 }
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
      from: 'onboarding@resend.dev', // Resend's default sender
      to: ['congyao@bu.edu'], // Your verified email
      subject: `New Question for Cong from ${sanitizedName}`,
      html: `
        <h2>New Question for Cong!</h2>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        ${sanitizedWechatId ? `<p><strong>WeChat ID:</strong> ${sanitizedWechatId}</p>` : ''}
        <p><strong>Question:</strong></p>
        <p>${sanitizedMessage}</p>
        <hr>
        <p><small>Submitted from IP: ${ip} at ${new Date().toISOString()}</small></p>
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
      { message: 'Thank you!' },
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
