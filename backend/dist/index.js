"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const health_route_1 = __importDefault(require("./routes/health.route"));
const reports_route_1 = __importDefault(require("./routes/reports.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const cors_1 = __importDefault(require("cors"));
const excel_route_1 = __importDefault(require("./routes/excel.route"));
const worker_route_1 = __importDefault(require("./routes/worker.route"));
const errors_1 = __importDefault(require("./middlewares/errors"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true }));
console.log("request passed");
const allowedOrigins = [
    "https://api.fizotaggers.name.ng/api/v1",
    "http://localhost:5173",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"],
}));
app.use((0, helmet_1.default)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many request,Please try again later.",
}));
app.use("/api/v1", health_route_1.default);
app.use("/api/v1", reports_route_1.default);
app.use("/api/v1", excel_route_1.default);
app.use("/api/v1", payment_route_1.default);
app.use("/api/v1", worker_route_1.default);
app.use(errors_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map