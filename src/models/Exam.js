import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Exam = sequelize.define(
  "Exam",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passing_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 70,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "exams",
    timestamps: false,
  }
);

export default Exam;
