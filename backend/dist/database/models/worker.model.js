"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
const uuid_1 = require("uuid");
class Worker extends sequelize_1.Model {
}
exports.Worker = Worker;
Worker.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    workerId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: () => (0, uuid_1.v4)(),
    },
    password: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    role: {
        type: sequelize_1.DataTypes.ENUM("admin", "worker", "client"),
        defaultValue: "worker",
        allowNull: false,
    },
    resetToken: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    resetTokenExpiry: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, { sequelize: db_1.sequelize, tableName: "workers", timestamps: true });
//# sourceMappingURL=worker.model.js.map