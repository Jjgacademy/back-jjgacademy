import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const ExamAttempt = sequelize.define("ExamAttempt", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
  },
  passed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
