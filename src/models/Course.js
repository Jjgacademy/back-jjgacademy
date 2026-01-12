import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Course = sequelize.define("Course", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "courses",
  timestamps: false
});
