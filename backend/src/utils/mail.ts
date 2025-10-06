import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

console.log("Resend Api key loaded", process.env.RESEND_API_KEY ? "YES" : "NO");
const FROM_EMAIL = "FizoTaggers <onboarding@resend.dev>";

export const sendVerificationEmail = async (
  to: string,
  name: string,
  token: string
) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}&email=${to}`;

  const html = `
      <div style="font-family:sans-serif;line-height:1.5">
      <h2>Welcome, ${name} 👋</h2>
      <p>Thanks for signing up for FizoTaggers.</p>
      <p>Please confirm your email to activate your account:</p>
      <a href="${verifyUrl}" style="background:#2563eb;color:#fff;padding:10px 20px;text-decoration:none;border-radius:8px;">
        Verify Email
      </a>
      <p>If you didn’t request this, just ignore this message.</p>
    </div>`;

  try {
    console.log("sendiing email to", to);
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Verify your FizoTaggers account",
      html,
    });
    if (error) {
      console.error("Resend Api error", error);
    } else {
      console.log("Email Sent successfully");
    }
  } catch (error) {
    console.log("Failed to send Verifcation Email", error);
    throw new Error("Could not send verification email");
  }
};

//send password reset email
export const sendPasswordResetEmail = async (
  to: string,
  name: string,
  resetToken: string
) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${to}`;

  const html = `
    <div style="font-family:sans-serif;line-height:1.5">
      <h2>Hello, ${name}</h2>
      <p>We received a request to reset your password.</p>
      <p>Click below to set a new one:</p>
      <a href="${resetUrl}" style="background:#ef4444;color:#fff;padding:10px 20px;text-decoration:none;border-radius:8px;">
        Reset Password
      </a>
      <p>If you didn’t request this, you can safely ignore it.</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Reset your FizoTaggers password",
      html,
    });
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    throw new Error("Could not send password reset email");
  }
};
