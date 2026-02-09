import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

import User from "./User.js";
import Course from "./Course.js";

const UserCourse = sequelize.define(
  "user_courses",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    timestamps: false,
  }
);

User.belongsToMany(Course, {
  through: UserCourse,
  foreignKey: "user_id",
});

Course.belongsToMany(User, {
  through: UserCourse,
  foreignKey: "course_id",
});

export default UserCourse;
