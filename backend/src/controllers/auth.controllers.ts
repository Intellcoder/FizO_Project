import { Request, Response, NextFunction } from "express";
import { AuthServices } from "../services/authServices";
import { createPaymentData } from "../services/paymentServices";
import { Types } from "mongoose";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/mail";
import crypto from "crypto";
import User from "../database/models/user.model";

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

    const paymentData = await createPaymentData({
      date: new Date(),
      accountOwner: user._id as Types.ObjectId,
      totalSeconds: 0,
      totalAmount: 0,
    });

    //generate verifaication token

    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.verifyEmailToken = verifyToken;
    await user.save();

    //send verification email
    await sendVerificationEmail(user.email, user.name, verifyToken);

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

//verify Email

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token, email } = req.query;

    const user = await User.findOne({ email, verifyEmailToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Token Or Expired verification link.",
      });
    }

    user.isVerified = true;
    user.verifyEmailToken = undefined;

    await user.save();

    return res
      .status(200)
      .json({ message: "Email verified successfully.You can log in." });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

//REQUEST PASSWORD RESET
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await user.save();

    await sendPasswordResetEmail(user.email, user.name, resetToken);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, email, newPassword } = req.body;
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token." });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successful! You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//get user profile
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
