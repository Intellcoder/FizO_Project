import { Worker } from "./worker.model";
import { Account } from "./account.model";
import { Assignment } from "./assignment.model";
import { Report } from "./reports.model";
import { Payment } from "./paymentInfo.model";
import { AccountTransferHistory } from "./accountTransferHistory.model";
// associations:

//worker ->Account
Worker.hasMany(Account, {
  foreignKey: "ownerId",
  as: "accounts",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Account.belongsTo(Worker, {
  foreignKey: "ownerId",
  as: "owner",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

//Worker->Assignment
Worker.hasMany(Assignment, {
  foreignKey: "workerId",
  as: "assignments",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Assignment.belongsTo(Worker, {
  foreignKey: "workerId",
  as: "worker",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

//Account ->Assignment
Assignment.belongsTo(Account, {
  foreignKey: "accountId",
  as: "account",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Account.hasMany(Assignment, {
  foreignKey: "accountId",
  as: "assignments",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

//worker->Report
Worker.hasMany(Report, {
  foreignKey: "submitterId",
  as: "reports",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Report.belongsTo(Worker, {
  foreignKey: "submitterId",
  as: "submitter",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

//Account->Report
Report.belongsTo(Account, {
  foreignKey: "accountId",
  as: "account",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Account.hasMany(Report, {
  foreignKey: "accountId",
  as: "reports",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

(Report.belongsTo(Account, {
  foreignKey: "workerId",
  as: "workerAccount",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
}),
  Account.hasMany(Report, {
    foreignKey: "workerId",
    as: "workerReports",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  }));

Report.belongsTo(Worker, {
  foreignKey: "verifiedBy",
  as: "verifier",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Worker.hasMany(Report, {
  foreignKey: "verifiedBy",
  as: "verifiedReports",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
//worker->payment
Worker.hasOne(Payment, {
  foreignKey: "workerId",
  as: "payment",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Payment.belongsTo(Worker, {
  foreignKey: "workerId",
  as: "worker",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Account.hasMany(AccountTransferHistory, {
  foreignKey: "accountId",
  as: "transferHistory",
});
AccountTransferHistory.belongsTo(Account, {
  foreignKey: "accountId",
  as: "account",
});
export { Worker, Account, Assignment, Report, Payment };
