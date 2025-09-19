import {
  fetchTeamMemberProfile,
  fetchUserProfileDetails,
} from "../controllers/team.controller";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddlewaree";

const router = Router();

//fetch all userProfil by admin
router.route("/team").get(authMiddleware, fetchTeamMemberProfile);

//get user profile by user
router.route("/teamProfile").get(authMiddleware, fetchUserProfileDetails);

export default router;
