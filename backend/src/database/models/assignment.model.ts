import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/db";
import { Worker } from "./worker.model";

export type AssignmentType = "outsourced" | "owner" | "assignee";
export interface AssignmentAttributes {
  id: number;
  workerId: number;
  accountId: number;
  type: AssignmentType;
  active: boolean;
  startedAt: Date;
  endedAt?: Date | null;
}
type AssignmentCreate = Optional<AssignmentAttributes, "id" | "endedAt">;

export class Assignment
  extends Model<AssignmentAttributes, AssignmentCreate>
  implements AssignmentAttributes
{
  public id!: number;
  public workerId!: number;
  public accountId!: number;
  public type!: AssignmentType;
  public ratePerHour!: number;
  public active!: boolean;
  public startedAt!: Date;
  public endedAt?: Date | null;
}
Assignment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    workerId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    accountId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    type: {
      type: DataTypes.ENUM("outsourced", "owner", "assignee"),
      allowNull: false,
    },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    startedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    endedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, tableName: "assignments", timestamps: true }
);
