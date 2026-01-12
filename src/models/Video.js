import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

const Video = sequelize.define(
  "Video",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    video_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    orden: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "videos",   // 🔴 CLAVE
    timestamps: false,
  }
);

export default Video;
