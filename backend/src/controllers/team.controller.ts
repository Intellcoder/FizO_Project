import { Request, Response, NextFunction } from "express";

import {
  getAllTeamMembers,
  getTeamMember,
  getUserProfileDetails,
} from "../services/teamServices";

export async function fetchTeamMemberProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const workerId = req.params.id;
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Only Admin can access this route",
      });
    }

    if (workerId) {
      const worker = await getTeamMember(workerId);

      if (!worker) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json(worker);
    }

    const workers = await getAllTeamMembers();

    return res.status(200).json(workers);
  } catch (error) {
    next(error);
  }
}

export async function fetchUserProfileDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = (req as any).user;
    const userId = user._id;

    if (!userId) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const userProfile = await getUserProfileDetails(userId);
    console.log("get user request");
    return res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}
