"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class Report extends sequelize_1.Model {
}
exports.Report = Report;
Report.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    accountId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "accounts",
            key: "id",
        },
    },
    workerId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    submitterId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "workers",
            key: "id",
        },
    },
    imageUrl: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    workDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        validate: {
            isDate: true,
            notNull: { msg: "Work date is requuired" },
        },
    },
    workHours: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
        allowNull: false,
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    verifiedBy: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: "workers",
            key: "id",
        },
    },
    verifiedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    rawText: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: "reports",
    timestamps: true,
    indexes: [
        { fields: ["accountId"] },
        { fields: ["workerId"] },
        { fields: ["submitterId"] },
        { fields: ["workDate"] },
        { fields: ["status"] },
    ],
});
//# sourceMappingURL=reports.model.js.map