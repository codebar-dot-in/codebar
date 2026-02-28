import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Transporter configuration for Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error("SMTP Connection Error:", error);
    } else {
        console.log("SMTP Server is ready to take our messages");
    }
});

// Helper function to generate HTML email for Codebar Support
const generateSupportEmailHTML = (data) => {
    return `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 1px solid #eee;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="400" height="100" style="display: block; margin: 0 auto;">
                  <defs>
                    <style>
                      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap');
                      .logo-text {
                        font-family: 'Inter', sans-serif;
                        font-weight: 700;
                        font-size: 80px;
                        letter-spacing: -0.05em;
                        dominant-baseline: middle;
                        text-anchor: middle;
                      }
                    </style>
                  </defs>
                  
                  <!-- Background rect for visibility if needed, remove fill for transparency -->
                  <!-- <rect width="100%" height="100%" fill="white" /> -->
                
                  <text x="50%" y="50%" class="logo-text">
                    <tspan fill="#000000">cod≡</tspan><tspan fill="#2563eb">bar</tspan>
                  </text>
                </svg>
            </div>
            <div style="padding: 30px;">
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
                <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
                <p><strong>Service:</strong> ${data.service}</p>
                <p><strong>Industry:</strong> ${data.industry || 'Not provided'}</p>
                <p><strong>Budget:</strong> ${data.budget || 'Not provided'}</p>
                <div style="margin-top: 20px; background-color: #f9f9f9; padding: 15px; border-left: 4px solid #bf5af2;">
                    <strong>Message:</strong><br><br>
                    ${data.message.replace(/\n/g, '<br>')}
                </div>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                This email was sent from the Codebar website enquiry form.
            </div>
        </div>
    `;
};

// Helper function to generate auto-reply HTML for the User
const generateUserAutoReplyHTML = (data) => {
    return `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 1px solid #eee;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="400" height="100" style="display: block; margin: 0 auto;">
                  <defs>
                    <style>
                      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap');
                      .logo-text {
                        font-family: 'Inter', sans-serif;
                        font-weight: 700;
                        font-size: 80px;
                        letter-spacing: -0.05em;
                        dominant-baseline: middle;
                        text-anchor: middle;
                      }
                    </style>
                  </defs>
                  
                  <!-- Background rect for visibility if needed, remove fill for transparency -->
                  <!-- <rect width="100%" height="100%" fill="white" /> -->
                
                  <text x="50%" y="50%" class="logo-text">
                    <tspan fill="#000000">cod≡</tspan><tspan fill="#2563eb">bar</tspan>
                  </text>
                </svg>
            </div>
            <div style="padding: 30px;">
                <h3 style="margin-top: 0;">Hi ${data.name},</h3>
                <p>Thank you for reaching out to Codebar! We have received your enquiry regarding <strong>${data.service}</strong>.</p>
                <p>Our team is reviewing your project details and will get back to you within 24 hours with a tailored response or to schedule a consultation.</p>
                <p>In the meantime, feel free to explore <a href="https://codebar.in/#story" style="color: #2997ff;">Our Story</a> or read about <a href="https://codebar.in/#why-us" style="color: #2997ff;">Why Codebar</a>.</p>
                <br>
                <p>Best regards,<br><strong>Team Codebar</strong></p>
            </div>
            <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                Codebar Creative Technology Studio, Chennai<br>
                <a href="https://codebar.in" style="color: #666; text-decoration: none;">codebar.in</a> | <a href="mailto:support@codebar.in" style="color: #2997ff; text-decoration: none;">support@codebar.in</a><br>
                <a href="tel:+919940195863" style="color: #666; text-decoration: none;">+91 - 9940195863</a>
            </div>
        </div>
    `;
};

// API Endpoint for form submission
app.post('/api/enquiry', async (req, res) => {
    const data = req.body;

    // Basic validation
    if (!data.name || !data.email || !data.service || !data.message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // 1. Send Notification to Support Team
        await transporter.sendMail({
            from: `"Codebar Website" <${process.env.SMTP_USER}>`, // Sender address
            to: process.env.SMTP_USER, // Send to yourself
            replyTo: data.email,
            subject: `New Lead: ${data.service} - ${data.name}`,
            html: generateSupportEmailHTML(data)
        });

        // 2. Send Auto-Reply to the User
        await transporter.sendMail({
            from: `"Team Codebar" <${process.env.SMTP_USER}>`,
            to: data.email,
            subject: `Request Received: ${data.service} @ Codebar`,
            html: generateUserAutoReplyHTML(data)
        });

        res.status(200).json({ success: true, message: 'Enquiry submitted successfully' });

    } catch (error) {
        console.error("Email Sending Error:", error);
        res.status(500).json({ error: 'Failed to send emails. Please try again later.' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

