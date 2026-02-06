import { NextFunction, Request, Response } from "express";
import {
  assignAccountToWorker,
  reassignAccountOwner,
  createAccount,
} from "../services/accountServices";

export const createNewAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("request  to create account");
    const user = (req as any).user;
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

    const newAccount = await createAccount({
      account_name,
      locale,
      ownerId,
      workerId,
    });

    await assignAccountToWorker({ accountId: ownerId, workerId });
    return res.status(200).json({
      message: "Account created successfully",
      worker: newAccount,
    });
  } catch (error) {
    next(error);
  }
};

export const assignAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountId, newOwnerId } = req.body;
    if (!accountId || !newOwnerId)
      return res
        .status(400)
        .json({ message: "accountId and newOwnerId required" });

    const result = await reassignAccountOwner(
      Number(accountId),
      Number(newOwnerId)
    );

    return res.status(200).json({
      success: true,
      message: "Account ownership transferred successfully",
      newAssignment: result,
    });
  } catch (error) {
    next(error);
  }
};

export const outSourceAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const { accountId, workerId } = req.body;
    if (user.role != "admin")
      return res.status(403).json({
        message: "Only Admins can assign Account",
      });
    const newOwnerId = workerId;
    const newOwner = await reassignAccountOwner(accountId, newOwnerId);

    return res.status(200).json({
      message: "Account Reassigned",
    });
  } catch (error) {
    next(error);
  }
};
