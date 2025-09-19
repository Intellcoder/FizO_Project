import { Request, Response, NextFunction } from "express";
import { AuthServices } from "../services/authServices";
import { createPaymentData } from "../services/paymentServices";
import { Types } from "mongoose";

const authServices = new AuthServices();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, name, password, locale } = req.body;
    if (!email || !password || !name || !locale) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    {
    }
    const { user, token } = await authServices.registerUser(
      email,
      name,
      password,
      locale
    );

    const accountOwnerId = user._id as Types.ObjectId;
    const date = new Date();
    const totalSeconds = 0;
    const totalAmount = 0;

    const paymentData = await createPaymentData({
      date,
      accountOwner: accountOwnerId,
      totalSeconds,
      totalAmount,
    });
    res.status(201).json({
      message: "Registration successfull",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password is required" });
    }

    const { token, user } = await authServices.login(email, password);
    res.status(200).json({
      message: "login successfull",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const user = await authServices.getUserFromToken(token);

    return res.status(200).json({ user });
  } catch (error: any) {
    return res.status(401).json({
      message: error.message || "unauthorized",
    });
  }
};
