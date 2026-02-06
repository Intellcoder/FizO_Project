import transport, { sender } from "../utils/mail";

interface EmailOptions {
  recipient: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({
  recipient,
  subject,
  text,
  html,
}: EmailOptions): Promise<void> {
  try {
    await transport.sendMail({
      from: `"FIZO Taggers" <${sender}>`,
      to: recipient,
      subject,
      text,
      html,
    });

    console.log(`Email sent to ${recipient}`);
  } catch (error) {
    console.log(`Failed to send email:`, error);
    throw new Error("Email sending failed");
  }
}
