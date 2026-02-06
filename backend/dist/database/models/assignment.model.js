"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignment = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class Assignment extends sequelize_1.Model {
}
exports.Assignment = Assignment;
Assignment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    workerId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    accountId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    type: {
        type: sequelize_1.DataTypes.ENUM("outsourced", "owner", "assignee"),
        allowNull: false,
    },
    active: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: true },
    startedAt: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    endedAt: { type: sequelize_1.DataTypes.DATE, allowNull: true },
}, { sequelize: db_1.sequelize, tableName: "assignments", timestamps: true });
//# sourceMappingURL=assignment.model.js.map