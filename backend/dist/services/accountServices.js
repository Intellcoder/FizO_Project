"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = createAccount;
exports.assignAccountToWorker = assignAccountToWorker;
exports.reassignAccountOwner = reassignAccountOwner;
exports.outsourceAccount = outsourceAccount;
exports.submitReport = submitReport;
exports.getVisibleReportsForWorker = getVisibleReportsForWorker;
const db_1 = require("../database/config/db");
const assignment_model_1 = require("../database/models/assignment.model");
const reports_model_1 = require("../database/models/reports.model");
const account_model_1 = require("../database/models/account.model");
const sequelize_1 = require("sequelize");
const accountTransferHistory_model_1 = require("../database/models/accountTransferHistory.model");
const paymentInfo_model_1 = require("../database/models/paymentInfo.model");
async function createAccount({ workerId, ownerId, locale, account_name, }) {
    const newAccount = await account_model_1.Account.create({
        account_name,
        ownerId,
        locale,
        workerId,
    });
    await assignAccountToWorker({
        accountId: newAccount.id,
        workerId: workerId,
    });
    console.log(newAccount);
    return newAccount;
}
async function assignAccountToWorker({ accountId, workerId, }) {
    return await db_1.sequelize.transaction(async (t) => {
        await assignment_model_1.Assignment.update({ active: false, endedAt: new Date() }, { where: { accountId, type: "assignee", active: true }, transaction: t });
        console.log("assignment running");
        const newAssign = await assignment_model_1.Assignment.create({
            workerId,
            accountId,
            type: "owner",
            active: true,
            startedAt: new Date(),
        }, { transaction: t });
        return newAssign;
    });
}
async function reassignAccountOwner(accountId, newOwnerId) {
    const newOwnerAssignment = await db_1.sequelize.transaction(async (t) => {
        const account = await account_model_1.Account.findByPk(accountId, { transaction: t });
        if (!account)
            throw new Error("Account not found");
        const previousOwnerId = account.ownerId;
        if (previousOwnerId === newOwnerId)
            throw new Error("This worker is already the account owner");
        await assignment_model_1.Assignment.update({ active: false, endedAt: new Date() }, { where: { accountId, active: true }, transaction: t });
        await account.update({ ownerId: newOwnerId }, { transaction: t });
        const newAssignment = await assignment_model_1.Assignment.create({
            workerId: newOwnerId,
            accountId,
            type: "owner",
            active: true,
            startedAt: new Date(),
        }, { transaction: t });
        await accountTransferHistory_model_1.AccountTransferHistory.create({
            accountId,
            previousOwnerId,
            newOwnerId,
            reason: `Admin transferred account new Worker`,
            transferredAt: new Date(),
        }, { transaction: t });
        return newAssignment;
    });
    return newOwnerAssignment;
}
async function outsourceAccount(accountId, outsourcerWorkerId) {
    return await db_1.sequelize.transaction(async (t) => {
        const existing = await assignment_model_1.Assignment.findOne({
            where: {
                accountId,
                workerId: outsourcerWorkerId,
                type: "outsourced",
                active: true,
            },
            transaction: t,
        });
        if (existing)
            throw new Error("Worker already has active outsourced privilege");
        const a = await assignment_model_1.Assignment.create({
            workerId: outsourcerWorkerId,
            accountId,
            type: "outsourced",
            active: true,
            startedAt: new Date(),
        }, { transaction: t });
        return a;
    });
}
async function submitReport(accountId, submitterId, workHours, imageUrl, workerId, workDate, isOutsourced) {
    console.log("accountId", accountId, "workerId:", workerId);
    return await db_1.sequelize.transaction(async (t) => {
        const activeAssign = await assignment_model_1.Assignment.findOne({
            where: { accountId, workerId: submitterId, active: true },
            transaction: t,
        });
        console.log("passed 3.1");
        const account = await account_model_1.Account.findByPk(accountId, { transaction: t });
        if (!account)
            throw new Error("Account not found");
        const isOwner = account.ownerId === submitterId;
        console.log("passed 3.2");
        const activeOutsource = await assignment_model_1.Assignment.findOne({
            where: {
                accountId,
                type: "outsourced",
                active: true,
                workerId: { [sequelize_1.Op.ne]: submitterId },
            },
            transaction: t,
        });
        console.log("passed 3.3");
        if (isOwner && activeOutsource)
            throw new Error("Owner cannot submit while account is outsourced");
        let assignmentUsed = activeAssign;
        if (!assignmentUsed && isOwner) {
            assignmentUsed = { ratePerHour: 3000 };
        }
        if (!assignmentUsed)
            throw new Error("You do not have permission to submit for this account");
        console.log("passed 4.1");
        const ratePerHour = assignmentUsed.ratePerHour;
        const totalPay = Math.round(ratePerHour * workHours);
        let ownerShare = 0;
        if (assignmentUsed.type === "outsourced") {
            ownerShare = Math.round(1000 * workHours);
        }
        else {
            ownerShare = 0;
        }
        console.log("passed 4.2");
        const created = await reports_model_1.Report.create({
            accountId,
            submitterId,
            imageUrl,
            workHours,
            workerId,
            workDate,
        }, { transaction: t });
        console.log("passed 4.4");
        const [payment] = await paymentInfo_model_1.Payment.findOrCreate({
            where: { workerId: workerId },
            defaults: { totalHours: 0, totalPay: 0, workerId: workerId },
            transaction: t,
        });
        const rate = isOutsourced ? 2000 : 3000;
        const additionalPay = rate * (workHours / 3600);
        payment.totalHours += workHours;
        payment.totalHours += additionalPay;
        await payment.increment({
            totalHours: workHours,
            totalPay: additionalPay,
        }, { transaction: t });
        console.log("passed 5.0");
        return created;
    });
}
async function getVisibleReportsForWorker(workerId) {
    const ownReports = await reports_model_1.Report.findAll({
        where: { submitterId: workerId },
        order: [["createdAt", "DESC"]],
    });
    const activeAssignments = await assignment_model_1.Assignment.findAll({
        where: { workerId, active: true },
    });
    const accountIds = activeAssignments.map((a) => a.accountId);
    const reportsForAssignedAccounts = accountIds.length
        ? await reports_model_1.Report.findAll({
            where: { accountId: accountIds },
            order: [["createdAt", "DESC"]],
        })
        : [];
    const ownedAccounts = await account_model_1.Account.findAll({ where: { ownerId: workerId } });
    const ownedIds = ownedAccounts.map((a) => a.id);
    const reportsForOwned = ownedIds.length
        ? await reports_model_1.Report.findAll({
            where: { accountId: ownedIds },
            order: [["createdAt", "DESC"]],
        })
        : [];
}
//# sourceMappingURL=accountServices.js.map