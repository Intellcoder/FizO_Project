"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const health_route_1 = __importDefault(require("./routes/health.route"));
const report_route_1 = __importDefault(require("./routes/report.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const cors_1 = __importDefault(require("cors"));
const excel_route_1 = __importDefault(require("./routes/excel.route"));
const team_routes_1 = __importDefault(require("./routes/team.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: ["https://fizotaggers.onrender.com", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((0, helmet_1.default)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many request,Please try again later.",
}));
app.use("/api/v1", auth_routes_1.default);
app.use("/api/v1", health_route_1.default);
app.use("/api/v1", report_route_1.default);
app.use("/api/v1", excel_route_1.default);
app.use("/api/v1", team_routes_1.default);
app.use("/api/v1", payment_route_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map