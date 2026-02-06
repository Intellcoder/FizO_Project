import { sequelize } from "../database/config/db";
import { Assignment } from "../database/models/assignment.model";
import { Report } from "../database/models/reports.model";
import { Account } from "../database/models/account.model";
import { Worker } from "../database/models/worker.model";
import { Op } from "sequelize";
import { AccountTransferHistory } from "../database/models/accountTransferHistory.model";
import { Payment } from "../database/models/paymentInfo.model";
/*
Automatic creating of account when a user is onboarded
*/

export async function createAccount({
  workerId,
  ownerId,
  locale,
  account_name,
}: {
  workerId: number;
  ownerId: number;
  locale: string;
  account_name: string;
}): Promise<Account> {
  const newAccount = await Account.create({
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

/**
 * Assign account to worker (admin action).
 * This will deactivate previous active assignee assignments for the account.
 * It creates a new 'assignee' assignment with provided ratePerHour.
 */
export async function assignAccountToWorker({
  accountId,
  workerId,
}: {
  accountId: number;
  workerId: number;
}): Promise<Assignment> {
  return await sequelize.transaction(async (t) => {
    // deactivate previous 'assignee' assignments
    await Assignment.update(
      { active: false, endedAt: new Date() },
      { where: { accountId, type: "assignee", active: true }, transaction: t },
    );
    console.log("assignment running");
    // create new assignee assignment
    const newAssign = await Assignment.create(
      {
        workerId,
        accountId,
        type: "owner",
        active: true,
        startedAt: new Date(),
      },
      { transaction: t },
    );

    // optionally update account owner? (the owner remains owner unless admin explicitly reassigns owner)
    return newAssign;
  });
}

/**
 * Reassign owner of account (admin action).
 * This transfers ownership and deactivates all previous assignments except keep owners reports visible to creators.
 */
export async function reassignAccountOwner(
  accountId: number,
  newOwnerId: number,
) {
  const newOwnerAssignment = await sequelize.transaction(async (t) => {
    const account = await Account.findByPk(accountId, { transaction: t });
    if (!account) throw new Error("Account not found");

    const previousOwnerId = account.ownerId;
    if (previousOwnerId === newOwnerId)
      throw new Error("This worker is already the account owner");

    // 1️⃣ Deactivate all existing assignments (owner, assignee, outsourced)
    await Assignment.update(
      { active: false, endedAt: new Date() },
      { where: { accountId, active: true }, transaction: t },
    );

    // 2️⃣ Update account owner
    await account.update({ ownerId: newOwnerId }, { transaction: t });

    // 3️⃣ Create new owner assignment
    const newAssignment = await Assignment.create(
      {
        workerId: newOwnerId,
        accountId,
        type: "owner",
        active: true,
        startedAt: new Date(),
      },
      { transaction: t },
    );

    await AccountTransferHistory.create(
      {
        accountId,
        previousOwnerId,
        newOwnerId,
        reason: `Admin transferred account new Worker`,
        transferredAt: new Date(),
      },
      { transaction: t },
    );
    return newAssignment;
  });
  return newOwnerAssignment;
}

/**
 * Outsource an account to another worker (admin action).
 * Creates an 'outsourced' assignment active (ratePerHour = 2000).
 * Owner still keeps ownership but cannot submit while outsourcing is active.
 */
export async function outsourceAccount(
  accountId: number,
  outsourcerWorkerId: number,
) {
  return await sequelize.transaction(async (t) => {
    // create outsourced assignment
    const existing = await Assignment.findOne({
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

    // create new outsourcer assignment
    const a = await Assignment.create(
      {
        workerId: outsourcerWorkerId,
        accountId,
        type: "outsourced",
        active: true,
        startedAt: new Date(),
      },
      { transaction: t },
    );
    return a;
  });
}

/**
 * Submit a report. Enforces who can submit:
 * - the submitter must have an active assignment of type 'assignee' OR 'outsourced'
 * - OR be the owner and no active outsourced assignment prevents owner submission
 * Returns the created report with pay calculation.
 */
export async function submitReport(
  accountId: number,
  submitterId: number,
  workHours: number,
  imageUrl: string,
  workerId: number,
  workDate: Date,
  isOutsourced: Boolean,
) {
  console.log("accountId", accountId, "workerId:", workerId);
  return await sequelize.transaction(async (t) => {
    // find active assignment for submitter on this account
    const activeAssign = await Assignment.findOne({
      where: { accountId, workerId: submitterId, active: true },
      transaction: t,
    });

    // determine allowed and rates:
    // If person is owner:
    console.log("passed 3.1");
    const account = await Account.findByPk(accountId, { transaction: t });
    if (!account) throw new Error("Account not found");

    const isOwner = account.ownerId === submitterId;
    console.log("passed 3.2");
    // if owner, check if there exists an active outsourced assignment by others -> owner cannot submit while outsourcing active
    const activeOutsource = await Assignment.findOne({
      where: {
        accountId,
        type: "outsourced",
        active: true,
        workerId: { [Op.ne]: submitterId },
      },
      transaction: t,
    });

    console.log("passed 3.3");
    if (isOwner && activeOutsource)
      throw new Error("Owner cannot submit while account is outsourced");

    // submitter must be either:
    // - an active assignee OR active outsourced OR the owner (and no active outsourcer)
    let assignmentUsed = activeAssign;
    if (!assignmentUsed && isOwner) {
      // owners submit with default owner rate (e.g., 3000 when owner handles own account)
      // If owner submits and there is no assignment, default rate = 3000
      assignmentUsed = { ratePerHour: 3000 } as any;
    }

    if (!assignmentUsed)
      throw new Error("You do not have permission to submit for this account");

    console.log("passed 4.1");
    const ratePerHour = assignmentUsed.ratePerHour;
    const totalPay = Math.round(ratePerHour * workHours);
    let ownerShare = 0;

    // if assignment used is outsourced, owner gets 1000 per hour (if assignment type outsourced)
    if (assignmentUsed.type === "outsourced") {
      ownerShare = Math.round(1000 * workHours);
    } else {
      // regular assignment or owner submission: owner gets 0 (full paid to submitter)
      ownerShare = 0;
    }

    console.log("passed 4.2");
    const created = await Report.create(
      {
        accountId,
        submitterId,
        imageUrl,
        workHours,
        workerId,
        workDate,
      },
      { transaction: t },
    );

    console.log("passed 4.4");
    const [payment] = await Payment.findOrCreate({
      where: { workerId: workerId },
      defaults: { totalHours: 0, totalPay: 0, workerId: workerId },
      transaction: t,
    });

    const rate = isOutsourced ? 2000 : 3000;
    const additionalPay = rate * (workHours / 3600);

    payment.totalHours += workHours;
    payment.totalHours += additionalPay;

    await payment.increment(
      {
        totalHours: workHours,
        totalPay: additionalPay,
      },
      { transaction: t },
    );

    console.log("passed 5.0");
    return created;
  });
}

/**
 * Get reports visible to a worker:
 * - A worker always sees reports they submitted.
 * - If worker has an active assignment of type 'assignee' or 'outsourced' on the account
 *   they may see all reports for that account that were submitted **while their assignment was active**
 *   (so they don't see earlier reports by other workers unless they created them).
 * - Owner can see reports for their accounts (including outsourced reports) — but still can't submit when outsourced.
 *
 * Note: For simplicity we give:
 * - submitter: always sees their own reports
 * - active assignee or outsourcer: sees reports that exist for that account (we could filter by time range if required)
 * - owner: sees reports on their account always
 */
export async function getVisibleReportsForWorker(workerId: number) {
  // worker's own reports:
  const ownReports = await Report.findAll({
    where: { submitterId: workerId },
    order: [["createdAt", "DESC"]],
  });

  // accounts where worker is active assignee/outsourced
  const activeAssignments = await Assignment.findAll({
    where: { workerId, active: true },
  });
  const accountIds = activeAssignments.map((a) => a.accountId);

  const reportsForAssignedAccounts = accountIds.length
    ? await Report.findAll({
        where: { accountId: accountIds },
        order: [["createdAt", "DESC"]],
      })
    : [];

  // owner accounts
  const ownedAccounts = await Account.findAll({ where: { ownerId: workerId } });
  const ownedIds = ownedAccounts.map((a) => a.id);
  const reportsForOwned = ownedIds.length
    ? await Report.findAll({
        where: { accountId: ownedIds },
        order: [["createdAt", "DESC"]],
      })
    : [];

  // combine unique reports (but ensure worker sees them)
  //   const map = new Map<number, Report>();
  //   [...ownReports, ...reportsForAssignedAccounts, ...reportsForOwned].forEach(
  //     (r) => map.set(r.id, r)
  //   );
  //   return Array.from(map.values()).sort((a, b) => +b.createdAt - +a.createdAt);
}
