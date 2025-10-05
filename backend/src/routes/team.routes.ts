import {
  fetchTeamMemberProfile,
  fetchUserProfileDetails,
  deleteUserDetails,
  updateUserDetails,
} from "../controllers/team.controller";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddlewaree";

const router = Router();

//fetch all userProfil by admin
router.route("/team").get(authMiddleware, fetchTeamMemberProfile);

//get user profile by user
router.route("/teamProfile").get(authMiddleware, fetchUserProfileDetails);

//route to update user
router.route("/team/:id").patch(updateUserDetails);

//route to delete user
router.route("/team/:id").delete(authMiddleware, deleteUserDetails);

export default router;
