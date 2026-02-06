import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";
import { Worker as User } from "../database/models/worker.model"; // adjust path to your Sequelize model

export interface AuthRequest extends Request {
  user?: any;
}

export default async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token and extract userId
    const decoded: any = verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Use Sequelize instead of Mongoose
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "email", "role"], // exclude password
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
