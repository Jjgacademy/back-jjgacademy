import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Question = sequelize.define(
  "Question",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    option_a: DataTypes.STRING,
    option_b: DataTypes.STRING,
    option_c: DataTypes.STRING,
    option_d: DataTypes.STRING,

    correct_option: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "questions",
    timestamps: false,
  }
);

export default Question;
