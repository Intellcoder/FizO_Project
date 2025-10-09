"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTeamMembers = getAllTeamMembers;
exports.getTeamMember = getTeamMember;
exports.deleteProfile = deleteProfile;
exports.updateProfile = updateProfile;
exports.getUserProfileDetails = getUserProfileDetails;
const user_model_1 = __importDefault(require("../database/models/user.model"));
async function getAllTeamMembers() {
    return await user_model_1.default.find({
        role: { $nin: ["admin"] },
    }, "name email locale totalSeconds role totalTask");
}
async function getTeamMember(workerId) {
    return await user_model_1.default.findById(workerId, "name locale totalSeconds");
}
async function deleteProfile(workerId) {
    return await user_model_1.default.findByIdAndDelete(workerId);
}
async function updateProfile(workerId, updateData) {
    return await user_model_1.default.findByIdAndUpdate(workerId, updateData, {
        new: true,
    });
}
async function getUserProfileDetails(userId) {
    return await user_model_1.default.findById(userId, "id name locale email totalSeconds workerid totalTask");
}
//# sourceMappingURL=teamServices.js.map