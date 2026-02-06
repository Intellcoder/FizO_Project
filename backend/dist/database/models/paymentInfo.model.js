"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db");
class Payment extends sequelize_1.Model {
}
exports.Payment = Payment;
Payment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    workerId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    totalPay: { type: sequelize_1.DataTypes.FLOAT, defaultValue: 0 },
    totalHours: { type: sequelize_1.DataTypes.FLOAT, defaultValue: 0 },
    account_name: { type: sequelize_1.DataTypes.STRING },
    account_number: { type: sequelize_1.DataTypes.STRING },
    bank: { type: sequelize_1.DataTypes.STRING },
}, { sequelize: db_1.sequelize, tableName: "payments", timestamps: true });
//# sourceMappingURL=paymentInfo.model.js.map