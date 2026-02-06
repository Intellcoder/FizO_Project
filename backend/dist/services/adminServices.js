"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorker = deleteWorker;
const db_1 = require("../database/config/db");
const index_1 = require("../database/models/index");
async function deleteWorker(workerId) {
    const transaction = await db_1.sequelize.transaction();
    try {
        const worker = await index_1.Worker.findByPk(workerId, {
            include: [
                { model: index_1.Account, as: "accounts" },
                { model: index_1.Assignment, as: "assignments" },
                { model: index_1.Report, as: "reports" },
                { model: index_1.Payment, as: "payment" },
            ],
            transaction,
        });
        if (!worker)
            throw new Error("Worker not found");
        const accounts = worker.get("accounts");
        const assignments = worker.get("assignments");
        const reports = worker.get("reports");
        const payment = worker.get("payment");
        for (const account of accounts) {
            await index_1.Assignment.destroy({
                where: { accountId: account.id },
                transaction,
            });
            await index_1.Report.destroy({ where: { accountId: account.id }, transaction });
        }
        await index_1.Assignment.destroy({ where: { workerId: worker.id }, transaction });
        await index_1.Report.destroy({ where: { submitterId: worker.id }, transaction });
        for (const account of accounts) {
            await account.destroy({ transaction });
        }
        if (payment)
            await payment.destroy({ transaction });
        await worker.destroy({ transaction });
        await transaction.commit();
        return { message: "Worker deleted successfully" };
    }
    catch (error) {
        await transaction.rollback();
        throw new Error(`Failed to delete worker: ${error.message}`);
    }
}
//# sourceMappingURL=adminServices.js.map