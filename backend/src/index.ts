import express, { Application } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import healthRoute from "./routes/health.route";
import reports from "./routes/reports.route";
import payment from "./routes/payment.route";
import cors from "cors";
import viewExcel from "./routes/excel.route";
import worker from "./routes/worker.route";
import ErrorHandler from "./middlewares/errors";

const app: Application = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
console.log("request passed");
const allowedOrigins = [
  "https://api.fizotaggers.name.ng/api/v1",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }, //allowed origins (urls/client)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
  }),
);

//security HTTP headers
app.use(helmet());

//Rate limiting to avoid brute force
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100, //max request per IP
    message: "Too many request,Please try again later.",
  }),
);

app.use("/api/v1", healthRoute);
app.use("/api/v1", reports);
app.use("/api/v1", viewExcel);
app.use("/api/v1", payment);
app.use("/api/v1", worker);

app.use(ErrorHandler);

export default app;
