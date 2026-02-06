import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_USER || "joshuacee124@gmail.com",
    pass: process.env.BREVO_API_KEY, // from Brevo dashboard
  },
});

// ✅ Send Verification Email
export async function sendVerificationEmail(to: string, token: string) {
  const verificationLink = `https://yourfrontend.com/verify-email?token=${token}`;

  const mailOptions = {
    from: '"FizoTaggers" <joshuacee124@gmail.com>', // Must match verified sender
    to,
    subject: "Verify your FizoTaggers Account",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Welcome to FizoTaggers 🎉</h2>
        <p>Click below to verify your email address:</p>
        <a href="${verificationLink}" 
           style="background-color:#007bff;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">
           Verify Email
        </a>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Verification email sent to ${to}`);
}

// ✅ Send Password Reset Email
export async function sendPasswordResetEmail(to: string, token: string) {
  const resetLink = `https://yourfrontend.com/reset-password?token=${token}`;

  const mailOptions = {
    from: '"FizoTaggers Support" <joshuacee124@gmail.com>',
    to,
    subject: "Password Reset Request",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Password Reset Requested</h2>
        <p>We received a request to reset your password.</p>
        <p>If this was you, click below to set a new password:</p>
        <a href="${resetLink}"
           style="background-color:#28a745;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">
           Reset Password
        </a>
        <p>This link expires in 24 hours.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Password reset email sent to ${to}`);
}
