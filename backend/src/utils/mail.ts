import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// reusable sender info

export const sender = process.env.EMAIL_USER;

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default transport;
