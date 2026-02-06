// models/Payment.ts
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

export interface PaymentAttributes {
  id: number;
  workerId: number;
  totalPay: number;
  totalHours: number;
  account_name: string;
  account_number: string;
  bank: string;
}

type PaymentCreation = Optional<
  PaymentAttributes,
  "id" | "totalPay" | "totalHours" | "account_name" | "account_number" | "bank"
>;

export class Payment
  extends Model<PaymentAttributes, PaymentCreation>
  implements PaymentAttributes
{
  public id!: number;
  public workerId!: number;
  public totalPay!: number;
  public totalHours!: number;
  public account_name!: string;
  public account_number!: string;
  public bank!: string;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    workerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    totalPay: { type: DataTypes.FLOAT, defaultValue: 0 },
    totalHours: { type: DataTypes.FLOAT, defaultValue: 0 },
    account_name: { type: DataTypes.STRING },
    account_number: { type: DataTypes.STRING },
    bank: { type: DataTypes.STRING },
  },
  { sequelize, tableName: "payments", timestamps: true }
);
