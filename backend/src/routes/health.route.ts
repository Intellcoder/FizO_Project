import { Router, Request, Response, NextFunction } from "express";
import { Server } from "http";
import mongoose from "mongoose";

const router = Router();

async function checkDB(): Promise<boolean> {
  try {
    if (mongoose.connection.readyState !== 1) return false;

    const db = mongoose.connection.db;

    if (!db) return false;

    await db.admin().ping();
    return true;
  } catch (error) {
    console.error("DB check failed:", (error as Error).message);
    return false;
  }
}

router.get("/", async (req: Request, res: Response) => {
  const timeStamp = new Date().toISOString();

  const [dbOk] = await Promise.all([checkDB()]);

  let status: "OK" | "DEGRADED" | "DOWN" = "OK";

  if (!dbOk) {
    status = "DEGRADED";
  }

  if (!dbOk) {
    status = "DOWN";
  }
  res.status(status === "OK" ? 200 : 503).json({
    status,
    services: {
      Server: true,
      database: dbOk,
    },
    timeStamp,
  });
});

export default router;
