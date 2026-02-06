"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class Account extends sequelize_1.Model {
}
exports.Account = Account;
Account.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    account_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    workerId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    accountUUID: { type: sequelize_1.DataTypes.UUID, defaultValue: sequelize_1.DataTypes.UUIDV4 },
    locale: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    ownerId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
}, { sequelize: db_1.sequelize, tableName: "accounts", timestamps: true });
//# sourceMappingURL=account.model.js.map