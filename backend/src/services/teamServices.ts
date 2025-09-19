import { StringDecoder } from "node:string_decoder";
import User from "../database/models/user.model";

export async function getAllTeamMembers() {
  return await User.find(
    {
      role: { $nin: ["admin"] },
    },
    "name locale totalSeconds role"
  );
}

export async function getTeamMember(workerId: string) {
  return await User.findById(workerId, "name locale totalSeconds");
}

export async function deleteProfile(workerId: string) {
  return await User.findByIdAndDelete(workerId);
}

export async function updateProfile(
  workerId: string,
  updateData: Partial<any>
) {
  return await User.findByIdAndUpdate(workerId, updateData, {
    new: true,
  });
}

export async function getUserProfileDetails(userId: string) {
  return await User.findById(
    userId,
    "id name locale email totalSeconds workerid"
  );
}
