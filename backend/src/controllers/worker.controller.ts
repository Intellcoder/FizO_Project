import { Request, Response, NextFunction } from "express";
import {
  createWorker,
  loginWorker,
  getWorkerProfile,
  getAllWorkersProfile,
  updatePaymentInfo,
  requestPasswordReset,
  resetPassword,
} from "../services/workerServices";
import { createPaymentInfo } from "../services/paymentServices";
import { createAccount } from "../services/accountServices";
import { deleteWorker } from "../services/adminServices";
import { Assignment, Payment } from "../database/models";
import { Account } from "../database/models";
import { sendEmail } from "../services/emailServices";
import { customError } from "../middlewares/errors";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role, account_name, locale } = req.body;

    console.log(req.body);
    if (!name || !email || !password || !role || !account_name || !locale)
      return res.status(404).json({
        message: "All fileds are required",
      });

    const { worker } = await createWorker(name, email, password, role);
    //create a new acct
    const newAccount = await createAccount({
      account_name,
      locale,
      ownerId: worker.id,
      workerId: worker.id,
    });
    //assign account permission
    // await assignAccountToWorker({
    //   accountId: newAccount.id,
    //   workerId: worker.id,
    // });

    const paymentInfo = await createPaymentInfo(worker.id);

    res.status(200).json({
      success: true,
      message: "SignUp successfull",
    });
  } catch (error) {
    return next(customError(error, 500));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        message: "Email and Password is required",
      });
    console.log("request recived");
    const { worker, token } = await loginWorker(email, password);
    return res.status(200).json({
      worker,
      token,
    });
  } catch (error) {
    return next(customError(error, 500));
  }
};

export const profile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;
    const { id, role } = user;

    if (role == "admin") {
      const workers = await getAllWorkersProfile();

      return res.status(200).json(workers);
    }

    const worker = await getWorkerProfile(id);
    if (!worker)
      return res.status(404).json({
        message: "Worker not found",
      });
    return res.status(200).json(worker);
  } catch (error) {
    return next(customError(error, 500));
  }
};

export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;

    const workerId = Number(id);
    if (user.role != "admin")
      return res.status(403).json({
        message: "Only Admin can delete User",
      });

    const deleteUser = await deleteWorker(workerId);

    if (!deleteUser) {
      return res.status(404).json({ message: "Failed to delete profile" });
    }
    return res.status(200).json({
      message: "Profile deleted",
    });
  } catch (error) {
    return next(customError(error, 500));
  }
};

export const getMyAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    const accounts = await Account.findAll({
      where: { ownerId: user.id },
      attributes: ["id", "account_name", "locale", "ownerId"],
    });

    if (!accounts) {
      return res.status(404).json({
        meesage: "No account associated with this worker",
      });
    }

    return res.status(200).json(accounts);
  } catch (error) {
    return next(customError(error, 500));
  }
};

export const getPaymentInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).user;

    if (!user) return res.status(404).json("User not Authenticated");
    const paymentInfo = await Payment.findOne({
      where: { workerId: user.id },
      attributes: [
        "totalPay",
        "totalHours",
        "account_name",
        "account_number",
        "bank",
      ],
    });

    if (!paymentInfo)
      return res.status(400).json("User payment record not found");

    return res.status(200).json(paymentInfo);
  } catch (error) {
    return next(customError(error, 500));
  }
};

export const updatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("payment request recieved");
    const user = (req as any).user;
    const updates = req.body;

    if (!user)
      return res.status(404).json({
        message: "user not found",
      });

    const workerId = user.id;

    if (!workerId) {
      return res.status(404).json({
        message: "User not found,missing Id",
      });
    }
    const updated = await updatePaymentInfo(workerId, updates);

    if (!updated)
      return res.status(400).json({ message: "Payment Update Failed" });

    console.log(updated);
    return res.status(200).json(updated);
  } catch (error) {
    return next(customError(error, 500));
  }
};

export const resetPasswordRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("Request recsived");
    const { email } = req.body;
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const result = await requestPasswordReset(email, frontendUrl);
    res.status(200).json(result);
  } catch (err: any) {
    return next(customError(err, 500));
  }
};

export const handleResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("request for password");
    console.log(req.body);
    const { token, email, newPassword } = req.body;
    const result = await resetPassword(token, email, newPassword);
    res.status(200).json(result);
  } catch (err: any) {
    return next(customError(err, 500));
  }
};
