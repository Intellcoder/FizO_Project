"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTeamMemberProfile = fetchTeamMemberProfile;
exports.fetchUserProfileDetails = fetchUserProfileDetails;
exports.deleteUserDetails = deleteUserDetails;
exports.updateUserDetails = updateUserDetails;
const teamServices_1 = require("../services/teamServices");
async function fetchTeamMemberProfile(req, res, next) {
    try {
        const user = req.user;
        const workerId = req.params.id;
        if (user.role !== "admin") {
            return res.status(403).json({
                message: "Only Admin can access this route",
            });
        }
        if (workerId) {
            const worker = await (0, teamServices_1.getTeamMember)(workerId);
            if (!worker) {
                return res.status(404).json({
                    message: "User not found",
                });
            }
            return res.status(200).json(worker);
        }
        const workers = await (0, teamServices_1.getAllTeamMembers)();
        return res.status(200).json(workers);
    }
    catch (error) {
        next(error);
    }
}
async function fetchUserProfileDetails(req, res, next) {
    try {
        const user = req.user;
        const userId = user._id;
        if (!userId) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const userProfile = await (0, teamServices_1.getUserProfileDetails)(userId);
        return res.status(200).json(userProfile);
    }
    catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
}
async function deleteUserDetails(req, res, next) {
    try {
        const workerId = req.params.id;
        const user = req.user;
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
        const deleted = await (0, teamServices_1.deleteProfile)(workerId);
        if (!deleted) {
            return res.status(404).json({
                message: "Failed to delete Profile",
            });
        }
        return res.status(200).json({
            message: "User Profile deleted Successfully",
        });
    }
    catch (error) {
        next(error);
    }
}
async function updateUserDetails(req, res, next) {
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
        const updated = await (0, teamServices_1.updateProfile)(id, updateData);
        if (!updated) {
            return res.status(400).json({
                message: "Failed to update user Profile",
            });
        }
        return res.status(200).json({
            message: "User Profile updated",
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=team.controller.js.map