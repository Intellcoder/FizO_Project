"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = exports.Report = exports.Assignment = exports.Account = exports.Worker = void 0;
const worker_model_1 = require("./worker.model");
Object.defineProperty(exports, "Worker", { enumerable: true, get: function () { return worker_model_1.Worker; } });
const account_model_1 = require("./account.model");
Object.defineProperty(exports, "Account", { enumerable: true, get: function () { return account_model_1.Account; } });
const assignment_model_1 = require("./assignment.model");
Object.defineProperty(exports, "Assignment", { enumerable: true, get: function () { return assignment_model_1.Assignment; } });
const reports_model_1 = require("./reports.model");
Object.defineProperty(exports, "Report", { enumerable: true, get: function () { return reports_model_1.Report; } });
const paymentInfo_model_1 = require("./paymentInfo.model");
Object.defineProperty(exports, "Payment", { enumerable: true, get: function () { return paymentInfo_model_1.Payment; } });
const accountTransferHistory_model_1 = require("./accountTransferHistory.model");
worker_model_1.Worker.hasMany(account_model_1.Account, {
    foreignKey: "ownerId",
    as: "accounts",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
account_model_1.Account.belongsTo(worker_model_1.Worker, {
    foreignKey: "ownerId",
    as: "owner",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
worker_model_1.Worker.hasMany(assignment_model_1.Assignment, {
    foreignKey: "workerId",
    as: "assignments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
assignment_model_1.Assignment.belongsTo(worker_model_1.Worker, {
    foreignKey: "workerId",
    as: "worker",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
assignment_model_1.Assignment.belongsTo(account_model_1.Account, {
    foreignKey: "accountId",
    as: "account",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
account_model_1.Account.hasMany(assignment_model_1.Assignment, {
    foreignKey: "accountId",
    as: "assignments",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
worker_model_1.Worker.hasMany(reports_model_1.Report, {
    foreignKey: "submitterId",
    as: "reports",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
reports_model_1.Report.belongsTo(worker_model_1.Worker, {
    foreignKey: "submitterId",
    as: "submitter",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
reports_model_1.Report.belongsTo(account_model_1.Account, {
    foreignKey: "accountId",
    as: "account",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
account_model_1.Account.hasMany(reports_model_1.Report, {
    foreignKey: "accountId",
    as: "reports",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
(reports_model_1.Report.belongsTo(account_model_1.Account, {
    foreignKey: "workerId",
    as: "workerAccount",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
}),
    account_model_1.Account.hasMany(reports_model_1.Report, {
        foreignKey: "workerId",
        as: "workerReports",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }));
reports_model_1.Report.belongsTo(worker_model_1.Worker, {
    foreignKey: "verifiedBy",
    as: "verifier",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
});
worker_model_1.Worker.hasMany(reports_model_1.Report, {
    foreignKey: "verifiedBy",
    as: "verifiedReports",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
});
worker_model_1.Worker.hasOne(paymentInfo_model_1.Payment, {
    foreignKey: "workerId",
    as: "payment",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
paymentInfo_model_1.Payment.belongsTo(worker_model_1.Worker, {
    foreignKey: "workerId",
    as: "worker",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
account_model_1.Account.hasMany(accountTransferHistory_model_1.AccountTransferHistory, {
    foreignKey: "accountId",
    as: "transferHistory",
});
accountTransferHistory_model_1.AccountTransferHistory.belongsTo(account_model_1.Account, {
    foreignKey: "accountId",
    as: "account",
});
//# sourceMappingURL=index.js.map