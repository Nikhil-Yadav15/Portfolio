import { createTransport } from "nodemailer";
import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 5;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  const record = rateLimitMap.get(ip);
  
  if (now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count++;
  return false;
}

export async function POST(request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { 
          error: "Too many requests. Please try again later.",
          rateLimited: true 
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = contactSchema.parse(body);
    
    const { name, email, subject, message } = validatedData;

    if (!process.env.CONTACT_EMAIL || !process.env.CONTACT_PASSWORD) {
      console.error("Missing required environment variables: CONTACT_EMAIL or CONTACT_PASSWORD");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_PASSWORD, 
      },
    });

    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error("Email transporter verification failed:", verifyError);
      return NextResponse.json(
        { error: "Email service temporarily unavailable" },
        { status: 503 }
      );
    }

    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Portfolio Contact</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            color: #ffffff;
            padding: 20px;
            margin: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(6, 6, 20, 0.95);
            border-radius: 12px;
            border: 2px solid #8B5CF6;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
          }
          .header {
            background: linear-gradient(45deg, #8B5CF6, #3B0764);
            padding: 20px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            color: white;
            font-size: 24px;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          }
          .content {
            padding: 20px;
          }
          .field {
            background: #1a1a1a;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            border-left: 4px solid #8B5CF6;
          }
          .label {
            font-weight: bold;
            color: #a855f7;
            margin-bottom: 5px;
            display: block;
          }
          .value {
            color: #ffffff;
            word-wrap: break-word;
          }
          .message-field {
            border-left-color: #22d3ee;
          }
          .message-field .label {
            color: #22d3ee;
          }
          .footer {
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #333;
          }
          .timestamp {
            color: #ec4899;
            font-size: 12px;
            text-align: right;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name:</span>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <span class="label">Subject:</span>
              <div class="value">${subject}</div>
            </div>
            <div class="field message-field">
              <span class="label">Message:</span>
              <div class="value" style="white-space: pre-wrap; margin-top: 8px;">${message}</div>
            </div>
            <div class="timestamp">
              > Received: ${new Date().toLocaleString()}
            </div>
          </div>
          <div class="footer">
            Transmitted via Portfolio Contact System | Nikhil Yadav
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Portfolio Contact System" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `[Portfolio Contact] ${subject}`,
      html: htmlTemplate,
      replyTo: email,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);

    // Send confirmation email to the sender
    if (process.env.SEND_CONFIRMATION_EMAIL === "true") {
      const confirmationHtml = `
        <div style="font-family: 'Courier New', monospace; background: #0a0a0a; color: #fff; padding: 20px;">
          <h2 style="color: #8B5CF6;">Message Received! 🚀</h2>
          <p>Hi ${name},</p>
          <p>Thanks for reaching out! I've received your message about "<strong>${subject}</strong>" and will get back to you soon.</p>
          <div style="background: #1a1a1a; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22d3ee;">
            <strong>Your message:</strong><br>
            <div style="margin-top: 10px; white-space: pre-wrap;">${message}</div>
          </div>
          <p>Best regards,<br>Nikhil Yadav</p>
          <hr style="border: 1px solid #333; margin: 20px 0;">
          <small style="color: #666;">This is an automated response. Please don't reply to this email.</small>
        </div>
      `;

      await transporter.sendMail({
        from: `"Nikhil Yadav" <${process.env.CONTACT_EMAIL}>`,
        to: email,
        subject: `Re: ${subject} - Message Received`,
        html: confirmationHtml,
      });
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Message sent successfully!",
        messageId: info.messageId
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    if (error.code === 'EAUTH') {
      return NextResponse.json(
        { error: "Email authentication failed" },
        { status: 503 }
      );
    }

    if (error.code === 'ECONNECTION') {
      return NextResponse.json(
        { error: "Email service connection failed" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
