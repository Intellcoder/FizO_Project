"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const MONGO_URI = process.env.MONGODB_URI;
const PRODUCTION_MONGO_URI = process.env.PRODUCTION_MONGO_URI;
const connectDB = async () => {
    if (process.env.NODE_ENV === "PRODUCTION") {
        await mongoose_1.default
            .connect(PRODUCTION_MONGO_URI)
            .then(() => console.log(`Mongoose Running on production mode`))
            .catch((err) => {
            console.log(err.message);
            process.exit(1);
        });
    }
    else {
        await mongoose_1.default
            .connect(MONGO_URI)
            .then(() => console.log(`Mongodb running on local server`))
            .catch((err) => {
            console.log(err.message);
            process.exit(1);
        });
    }
};
exports.default = connectDB;
//# sourceMappingURL=config.js.map