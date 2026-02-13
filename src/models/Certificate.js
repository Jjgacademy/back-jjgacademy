import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Certificate = sequelize.define(
  "Certificate",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "certificates",
    timestamps: true,
  }
);

export default Certificate;
