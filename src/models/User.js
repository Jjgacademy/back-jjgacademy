import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const User = sequelize.define("users", {
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "student"
  }
});
