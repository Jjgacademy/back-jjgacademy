import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Community = sequelize.define(
  "Community",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "communities",
    freezeTableName: true,
  }
);

export default Community;
