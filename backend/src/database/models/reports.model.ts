import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";
import { Account } from "./account.model";
import { Worker } from "./worker.model";

export interface ReportAttributes {
  id: number;
  accountId: number;
  submitterId: number;
  imageUrl: string;
  workerId: number;
  workHours: number;
  workDate: Date;
  status: "pending" | "approved" | "rejected";
  notes?: string;
  verifiedBy?: number;
  verifiedAt?: number;
  rawText?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type ReportCreation = Optional<
  ReportAttributes,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "notes"
  | "verifiedBy"
  | "verifiedAt"
  | "createdAt"
  | "updatedAt"
>;
export class Report
  extends Model<ReportAttributes, ReportCreation>
  implements ReportAttributes
{
  public id!: number;
  public accountId!: number;
  public workerId!: number;
  public submitterId!: number;
  public imageUrl!: string;
  public workHours!: number;
  public workDate!: Date;
  public status!: "pending" | "approved" | "rejected";
  public notes?: string;
  public verifiedAt?: number;
  public verifiedBy?: number;
  public rawText?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public account?: Account;
  public submitter?: Worker;
  public workerAccount?: Account;
  public verifier?: Worker;
}
Report.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    accountId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "accounts",
        key: "id",
      },
    },
    workerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    submitterId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "workers",
        key: "id",
      },
    },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    workDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true,
        notNull: { msg: "Work date is requuired" },
      },
    },
    workHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    verifiedBy: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: "workers",
        key: "id",
      },
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rawText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "reports",
    timestamps: true,
    indexes: [
      { fields: ["accountId"] },
      { fields: ["workerId"] },
      { fields: ["submitterId"] },
      { fields: ["workDate"] },
      { fields: ["status"] },
    ],
  },
);
