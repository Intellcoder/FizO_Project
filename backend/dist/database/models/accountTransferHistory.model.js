"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountTransferHistory = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class AccountTransferHistory extends sequelize_1.Model {
}
exports.AccountTransferHistory = AccountTransferHistory;
AccountTransferHistory.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    accountId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    previousOwnerId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    newOwnerId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    transferredAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    reason: { type: sequelize_1.DataTypes.STRING, allowNull: true },
}, { sequelize: db_1.sequelize, modelName: "account_transfer_history", timestamps: false });
//# sourceMappingURL=accountTransferHistory.model.js.map