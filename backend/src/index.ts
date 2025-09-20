import express, { Application } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoute from "./routes/auth.routes";
import healthRoute from "./routes/health.route";
import reports from "./routes/report.route";
import cors from "cors";
import viewExcel from "./routes/excel.route";
import team from "./routes/team.routes";

const app: Application = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["https://fizotaggers.onrender.com", "http://localhost:5173/"], // or your deployed frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//security HTTP headers
app.use(helmet());

//Rate limiting to avoid brute force
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100, //max request per IP
    message: "Too many request,Please try again later.",
  })
);
app.use("/api/v1", authRoute);
app.use("/api/v1", healthRoute);
app.use("/api/v1", reports);
app.use("/api/v1", viewExcel);
app.use("/api/v1", team);

export default app;
