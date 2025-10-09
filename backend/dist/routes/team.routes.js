"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const team_controller_1 = require("../controllers/team.controller");
const express_1 = require("express");
const authMiddlewaree_1 = __importDefault(require("../middlewares/authMiddlewaree"));
const router = (0, express_1.Router)();
router.route("/team").get(authMiddlewaree_1.default, team_controller_1.fetchTeamMemberProfile);
router.route("/teamProfile").get(authMiddlewaree_1.default, team_controller_1.fetchUserProfileDetails);
router.route("/team/:id").patch(team_controller_1.updateUserDetails);
router.route("/team/:id").delete(authMiddlewaree_1.default, team_controller_1.deleteUserDetails);
exports.default = router;
//# sourceMappingURL=team.routes.js.map