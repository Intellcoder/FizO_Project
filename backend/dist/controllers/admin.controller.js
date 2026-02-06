"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outSourceAccount = exports.assignAccount = exports.createNewAccount = void 0;
const accountServices_1 = require("../services/accountServices");
const createNewAccount = async (req, res, next) => {
    try {
        console.log("request  to create account");
        const user = req.user;
        const { account_name, locale, ownerId, workerId } = req.body;
        if (!account_name || !locale || !ownerId || !workerId) {
            return res.status(400).json({ message: "All finds are required" });
        }
        console.log("passed 1");
        if (user.role != "admin") {
            return res.status(403).json({
                message: "Only admin can create account",
            });
        }
        const newAccount = await (0, accountServices_1.createAccount)({
            account_name,
            locale,
            ownerId,
            workerId,
        });
        await (0, accountServices_1.assignAccountToWorker)({ accountId: ownerId, workerId });
        return res.status(200).json({
            message: "Account created successfully",
            worker: newAccount,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createNewAccount = createNewAccount;
const assignAccount = async (req, res, next) => {
    try {
        const { accountId, newOwnerId } = req.body;
        if (!accountId || !newOwnerId)
            return res
                .status(400)
                .json({ message: "accountId and newOwnerId required" });
        const result = await (0, accountServices_1.reassignAccountOwner)(Number(accountId), Number(newOwnerId));
        return res.status(200).json({
            success: true,
            message: "Account ownership transferred successfully",
            newAssignment: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.assignAccount = assignAccount;
const outSourceAccount = async (req, res, next) => {
    try {
        const user = req.user;
        const { accountId, workerId } = req.body;
        if (user.role != "admin")
            return res.status(403).json({
                message: "Only Admins can assign Account",
            });
        const newOwnerId = workerId;
        const newOwner = await (0, accountServices_1.reassignAccountOwner)(accountId, newOwnerId);
        return res.status(200).json({
            message: "Account Reassigned",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.outSourceAccount = outSourceAccount;
//# sourceMappingURL=admin.controller.js.map