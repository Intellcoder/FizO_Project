import { Op } from "sequelize";
import { Report } from "../database/models/reports.model";
import { Worker } from "../database/models/worker.model";
import { Account } from "../database/models/account.model";
import { Assignment } from "../database/models/assignment.model";
import { sequelize } from "../database/config/db";
import { Payment } from "../database/models/paymentInfo.model";
/**
 * Fetch reports visible to a user, with optional cutoff and reassignment logic.
 *
 * - Admins: see all reports
 * - Non-admins:
 *   - See their own submitted reports always
 *   - See reports for accounts they owned (while owner)
 *   - See reports for accounts assigned to them (while assignment active)
 *
 * @param userId - Worker ID
 * @param isAdmin - Whether the user is an admin
 * @param cutoffDate - Optional date to limit reports (created after)
 */
export async function getAllReports(
  userId?: number,
  isAdmin: boolean = false,
  cutoffDate?: Date,
) {
  const whereClause: any = {};

  // Optional cutoff date (e.g., ?cutoff=2025-09-01)
  if (cutoffDate) {
    whereClause.createdAt = { [Op.gte]: cutoffDate };
  }

  // Admins see everything
  if (isAdmin) {
    return Report.findAll({
      where: whereClause,
      include: [
        {
          model: Worker,
          as: "submitter",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Account,
          as: "account",
          attributes: ["id", "account_name", "locale", "ownerId"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  // Fetch worker's active & past assignments
  const assignments = await Assignment.findAll({
    where: { workerId: userId },
    attributes: ["accountId", "startedAt", "endedAt"],
  });

  const conditions: any[] = [];

  // 1️⃣ Reports submitted by the worker
  conditions.push({ submitterId: userId });

  // 2️⃣ Reports from accounts they owned
  conditions.push({ "$account.ownerId$": userId });

  // 3️⃣ Reports submitted during active assignment windows
  for (const assign of assignments) {
    conditions.push({
      accountId: assign.accountId,
      createdAt: {
        [Op.between]: [
          assign.startedAt,
          assign.endedAt || new Date(), // still active if null
        ],
      },
    });
  }

  const reports = await Report.findAll({
    where: {
      ...whereClause,
      [Op.or]: conditions,
    },
    include: [
      {
        model: Worker,
        as: "submitter",
        attributes: ["id", "name", "email", "role"],
      },
      {
        model: Account,
        as: "account",
        attributes: ["id", "account_name", "locale", "ownerId"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return reports;
}

export async function deleteReport(id: number) {
  const transaction = await sequelize.transaction();

  try {
    // Find report inside transaction

    const report = await Report.findOne({ where: { id }, transaction });

    if (!report) {
      throw new Error("Report not found");
    }

    const { workHours, workerId } = report;

    const payment = await Payment.findOne({ where: { workerId } });

    if (!payment) {
      throw new Error("Payment record not found");
    }
    payment.totalHours = Math.max(payment.totalHours - workHours, 0);

    payment.save();
    // Store data before deleting (optional)
    const deletedData = report.get({ plain: true });

    // Delete within transaction
    await report.destroy({ transaction });

    // Commit transaction
    await transaction.commit();

    return { message: "Report deleted successfully", report: deletedData };
  } catch (error: any) {
    await transaction.rollback();
    throw new Error(`Failed to delete report: ${error.message}`);
  }
}

export async function updateReport(id: number, updates: Partial<Report>) {
  const transaction = await sequelize.transaction();

  try {
    // 1️⃣ Find report by ID
    const report = await Report.findOne({ where: { id }, transaction });
    if (!report) {
      throw new Error("Report not found");
    }

    // 2️⃣ Apply updates
    await report.update(updates, { transaction });

    // 3️⃣ Commit the transaction
    await transaction.commit();

    // 4️⃣ Return updated record
    return {
      message: "Report updated successfully",
      report: report.get({ plain: true }),
    };
  } catch (error: any) {
    await transaction.rollback();
    throw new Error(`Failed to update report: ${error.message}`);
  }
}
