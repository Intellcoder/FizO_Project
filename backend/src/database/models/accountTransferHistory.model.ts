// src/database/models/accountTransferHistory.model.ts
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";

interface AccountTransferHistoryAttributes {
  id: number;
  accountId: number;
  previousOwnerId: number;
  newOwnerId: number; // admin who performed transfer
  transferredAt: Date;
  reason?: string | null;
}

interface AccountTransferHistoryCreation
  extends Optional<AccountTransferHistoryAttributes, "id" | "reason"> {}

export class AccountTransferHistory
  extends Model<
    AccountTransferHistoryAttributes,
    AccountTransferHistoryCreation
  >
  implements AccountTransferHistoryAttributes
{
  public id!: number;
  public accountId!: number;
  public previousOwnerId!: number;
  public newOwnerId!: number;
  public transferredAt!: Date;
  public reason?: string | null;
}

AccountTransferHistory.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    accountId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    previousOwnerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    newOwnerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    transferredAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    reason: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "account_transfer_history", timestamps: false }
);
