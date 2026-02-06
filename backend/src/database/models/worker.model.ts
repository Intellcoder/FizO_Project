import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";
import { v4 as uuidv4 } from "uuid";

export interface WorkerAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  workerId: string;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  role: "admin" | "worker" | "client";
}
type WorkerCreation = Optional<
  WorkerAttributes,
  "id" | "workerId" | "resetToken" | "resetTokenExpiry"
>;

export class Worker
  extends Model<WorkerAttributes, WorkerCreation>
  implements WorkerAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public workerId!: string;
  public resetToken!: string | null;
  public resetTokenExpiry!: Date | null;

  public role!: "admin" | "worker" | "client";
}
Worker.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    workerId: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },
    password: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    role: {
      type: DataTypes.ENUM("admin", "worker", "client"),
      defaultValue: "worker",
      allowNull: false,
    },
    resetToken: { type: DataTypes.STRING, allowNull: true },
    resetTokenExpiry: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, tableName: "workers", timestamps: true },
);
