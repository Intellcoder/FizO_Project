import mongoose from "mongoose";
import User from "../database/models/user.model";
import Report from "../database/models/report.model";

export const incrementWorkerTotalTime = async (
  workerId: string,
  newSeconds: number
) => {
  const user = await User.findByIdAndUpdate(
    workerId,
    { $inc: { totalSeconds: newSeconds } },
    { new: true }
  );

  if (!user) {
    throw new Error(`User with ID ${workerId} not found`);
  }
  const totalSeconds = Number(user.totalSeconds) || 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { totalSeconds, hours, minutes, seconds };
};

export const recalculateWorkerTotalTime = async (workerId: string) => {
  const total = await Report.aggregate([
    { $match: { workerId: new mongoose.Types.ObjectId(workerId) } },
    { $group: { _id: null, totalSeconds: { $sum: "$totalSeconds" } } },
  ]);

  const totalSeconds = total.length > 0 ? total[0].totalSeconds : 0;

  await User.findByIdAndUpdate(workerId, { totalSeconds });

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { totalSeconds, hours, minutes, seconds };
};
