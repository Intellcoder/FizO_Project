"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const index_1 = __importDefault(require("./index"));
const config_1 = __importDefault(require("./database/config/config"));
const PORT = process.env.PORT || 4000;
(0, config_1.default)();
index_1.default.listen(PORT, () => console.log(`🚀Server Running on http//localhost:${PORT}`));
//# sourceMappingURL=server.js.map