import { sequelize } from "../database/config/db";
import {
  Worker,
  Account,
  Assignment,
  Report,
  Payment,
} from "../database/models/index";

export async function deleteWorker(workerId: number) {
  const transaction = await sequelize.transaction();

  try {
    // 1️⃣ Find the worker with all relations
    const worker = await Worker.findByPk(workerId, {
      include: [
        { model: Account, as: "accounts" },
        { model: Assignment, as: "assignments" },
        { model: Report, as: "reports" },
        { model: Payment, as: "payment" },
      ],
      transaction,
    });

    if (!worker) throw new Error("Worker not found");

    // Type assertion to include association properties
    const accounts = worker.get("accounts") as Account[];
    const assignments = worker.get("assignments") as Assignment[];
    const reports = worker.get("reports") as Report[];
    const payment = worker.get("payment") as Payment | null;

    // 2️⃣ Delete assignments linked to worker's accounts
    for (const account of accounts) {
      await Assignment.destroy({
        where: { accountId: account.id },
        transaction,
      });
      await Report.destroy({ where: { accountId: account.id }, transaction });
    }

    // 3️⃣ Delete worker's direct assignments & reports
    await Assignment.destroy({ where: { workerId: worker.id }, transaction });
    await Report.destroy({ where: { submitterId: worker.id }, transaction });

    // 4️⃣ Delete accounts
    for (const account of accounts) {
      await account.destroy({ transaction });
    }

    // 5️⃣ Delete payment
    if (payment) await payment.destroy({ transaction });

    // 6️⃣ Finally delete worker
    await worker.destroy({ transaction });

    // 7️⃣ Commit transaction
    await transaction.commit();

    return { message: "Worker deleted successfully" };
  } catch (error: any) {
    await transaction.rollback();
    throw new Error(`Failed to delete worker: ${error.message}`);
  }
}
