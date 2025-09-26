import mongoose from "mongoose";
import User from "../database/models/user.model";
import Report from "../database/models/report.model";

// Increment totals when a new report is added
export const incrementWorkerTotals = async (
  workerId: string,
  newSeconds: number,
  newTasks: number
) => {
  const user = await User.findByIdAndUpdate(
    workerId,
    {
      $inc: {
        totalSeconds: newSeconds,
        totalTask: newTasks, // ✅ increment total tasks too
      },
    },
    { new: true }
  );

  if (!user) {
    throw new Error(`User with ID ${workerId} not found`);
  }

  const totalSeconds = Number(user.totalSeconds) || 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalSeconds,
    totalTask: user.totalTask || 0, // ✅ include tasks in return
    hours,
    minutes,
    seconds,
  };
};

// Recalculate totals from scratch (in case reports change)
export const recalculateWorkerTotals = async (workerId: string) => {
  const total = await Report.aggregate([
    { $match: { workerId: new mongoose.Types.ObjectId(workerId) } },
    {
      $group: {
        _id: null,
        totalSeconds: { $sum: "$totalSeconds" },
        totalTask: { $sum: "$taskCount" }, // ✅ assumes each report has taskCount
      },
    },
  ]);

  const totalSeconds = total.length > 0 ? total[0].totalSeconds : 0;
  const totalTask = total.length > 0 ? total[0].totalTasks : 0;

  await User.findByIdAndUpdate(workerId, { totalSeconds, totalTask });

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalSeconds,
    totalTask,
    hours,
    minutes,
    seconds,
  };
};
