import { DataTypes } from "sequelize";
import sequelize from "../config/mysqldb.js";

const TaskStatusEnum = {
  OPEN: "open",
  INPROGRESS: "inprogress",
  COMPLETED: "completed",
};

const Task = sequelize.define(
  "Task",
  {
    // Define model attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(TaskStatusEnum),
      allowNull: false,
      defaultValue: TaskStatusEnum.OPEN,
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
);

export default Task;
