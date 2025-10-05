import { Request, Response, NextFunction } from "express";

import {
  deleteProfile,
  getAllTeamMembers,
  getTeamMember,
  getUserProfileDetails,
  updateProfile,
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

    return res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function deleteUserDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //function to delete profile

  try {
    const workerId = req.params.id;
    const user = (req as any).user;

    if (user.role != "admin") {
      return res.status(403).json({
        message: "Only admin can delete user profile",
      });
    }

    if (!workerId) {
      return res.status(400).json({
        message: "workerId is must be provided",
      });
    }

    const deleted = await deleteProfile(workerId);

    if (!deleted) {
      return res.status(404).json({
        message: "Failed to delete Profile",
      });
    }

    return res.status(200).json({
      message: "User Profile deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUserDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //function to update userdetails
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        message: "userId is missing and must be provided",
      });
    }

    if (!updateData) {
      return res.status(400).json({
        message: "Update details are missing",
      });
    }

    const updated = await updateProfile(id, updateData);

    if (!updated) {
      return res.status(400).json({
        message: "Failed to update user Profile",
      });
    }

    return res.status(200).json({
      message: "User Profile updated",
    });
  } catch (error) {
    next(error);
  }
}
