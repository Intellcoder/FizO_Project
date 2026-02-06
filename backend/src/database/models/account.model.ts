import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";
import { Worker } from "./worker.model";

export interface AccountAttributes {
  id: number;
  account_name: string;
  accountUUID: string;
  locale?: string;
  workerId: number;
  ownerId: number; // current owner
}
type AccountCreation = Optional<AccountAttributes, "id" | "accountUUID">;

export class Account
  extends Model<AccountAttributes, AccountCreation>
  implements AccountAttributes
{
  public id!: number;
  public account_name!: string;
  public workerId!: number;
  public accountUUID!: string;
  public locale!: string;
  public ownerId!: number;
}
Account.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    account_name: { type: DataTypes.STRING, allowNull: false },
    workerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    accountUUID: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    locale: { type: DataTypes.STRING, allowNull: false },
    ownerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  { sequelize, tableName: "accounts", timestamps: true }
);

// association to owner declared later in index
