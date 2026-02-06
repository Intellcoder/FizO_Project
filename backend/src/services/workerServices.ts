import { Payment } from "../database/models/paymentInfo.model";
import { Worker } from "../database/models/worker.model";
import { hashPassword, comparePassword, generateToken } from "../utils/helpers";
import { Account, Assignment } from "../database/models";
import { sequelize } from "../database/config/db";
import { sendEmail } from "./emailServices";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

const RESET_TOKEN_EXPIRY = 1000 * 60 * 1000; // 1 hour
export async function createWorker(
  name: string,
  email: string,
  password: string,
  role: "admin" | "worker" | "client",
) {
  const workerExist = await Worker.findOne({ where: { email } });

  if (workerExist) throw new Error("Email already exist");

  const hashed = await hashPassword(password);
  const worker = await Worker.create({
    name,
    email,
    password: hashed,
    role,
  });

  const token = await generateToken({
    id: worker.id,
    workerId: worker.workerId,
  });

  const link = `http://fizotaggers.name.ng/reset`;
  const message = `
  <h2>Welcome ${name} To FizzoTaggers</h2>
  <p>An account has been setup for you by admin</p>
  <p>Click the Link below to reset your password before you login</p>
  <p>Note:Use this same email as reset Email</p>

<p>Your password reset Email is:${email}</p>

  <a href="${link}">Login here</a>
  `;

  await sendEmail({
    recipient: email,
    subject: `FizzoTarggers Account Setup`,
    html: message,
  });

  return {
    worker,
    token,
  };
}

export async function loginWorker(email: string, password: string) {
  const worker = await Worker.findOne({ where: { email } });

  if (!worker) throw new Error("Invalid email or password");

  const isMatch = await comparePassword(password, worker.password);

  if (!isMatch) throw new Error("Invalid Password");

  const token = generateToken({ id: worker.id, workerId: worker.workerId });

  return { worker, token };
}

export async function getWorkerProfile(workerId: number) {
  const worker = await Worker.findOne({
    where: { id: workerId },
    attributes: ["id", "name", "email", "role", "workerId"],
    include: [
      { model: Payment, as: "payment", attributes: ["totalPay", "totalHours"] },
      {
        model: Account,
        as: "accounts",
        attributes: ["account_name", "locale", "ownerId"],
      },
      {
        model: Assignment,
        as: "assignments",
        attributes: [
          "workerId",
          "accountId",
          "type",
          "active",
          "startedAt",
          "endedAt",
        ],
      },
    ],
  });

  if (!worker) throw new Error("Worker Profile not found");

  return worker;
}

export async function getAllWorkersProfile() {
  const allWorkers = await Worker.findAll({
    attributes: ["id", "name", "email", "role", "workerId"],
    include: [
      {
        model: Payment,
        as: "payment",
        attributes: [
          "totalPay",
          "totalHours",
          "account_name",
          "account_number",
          "bank",
        ],
      },
      {
        model: Account,
        as: "accounts", // accounts they own
        attributes: ["id", "account_name", "locale", "ownerId"],
      },
      {
        model: Assignment,
        as: "assignments",
        attributes: [
          "workerId",
          "accountId",
          "type",
          "active",
          "startedAt",
          "endedAt",
        ],
        include: [
          {
            model: Account,
            as: "account", // the account they are assigned to
            attributes: ["id", "account_name", "locale", "ownerId"],
          },
        ],
      },
    ],
  });

  return allWorkers;
}

export async function updatePaymentInfo(
  workerId: number,
  updates: Partial<Pick<Payment, "account_name" | "account_number" | "bank">>,
) {
  const transaction = await sequelize.transaction();

  try {
    const payment = await Payment.findOne({
      where: { workerId },
      transaction,
    });

    if (!payment) {
      throw new Error("Payment record not found for this worker");
    }

    // ✅ Only update account fields
    await payment.update(
      {
        account_name: updates.account_name ?? payment.account_name,
        account_number: updates.account_number ?? payment.account_number,
        bank: updates.bank ?? payment.bank,
      },
      { transaction },
    );

    await transaction.commit();
    return payment;
  } catch (error: any) {
    await transaction.rollback();
    throw new Error(`Failed to update account details: ${error.message}`);
  }
}

export async function requestPasswordReset(email: string, frontendUrl: string) {
  const user = await Worker.findOne({ where: { email } });
  if (!user) throw new Error("No user found with that email");

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY);

  user.resetToken = hashedToken;
  user.resetTokenExpiry = expiresAt;
  await user.save();

  const resetLink = `${frontendUrl}/reset/password?token=${resetToken}&email=${email}`;

  const message = `
    <p>Hello ${user.name || ""},</p>
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>This link will expire in 10 minutes.</p>
  `;

  await sendEmail({
    recipient: email,
    subject: `Password Reset Request`,
    html: message,
  });
  return { message: "Password reset link sent" };
}

// Step 2: Reset password
export async function resetPassword(
  token: string,
  email: string,
  newPassword: string,
) {
  console.log("New password:", newPassword);
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await Worker.findOne({
    where: {
      email,
      resetToken: hashedToken,
      resetTokenExpiry: { [Op.gt]: new Date() },
    } as any, // Sequelize might need casting for operators
  });

  if (!user) throw new Error("Invalid or expired reset token");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpiry = null;

  await user.save();

  return { message: "Password updated successfully" };
}
