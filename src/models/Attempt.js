import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import Exam from "./Exam.js";

const Attempt = sequelize.define(
  "Attempt",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    puntaje: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    aprobado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    preguntas_usadas: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "attempts",
    timestamps: false,
  }
);

Attempt.belongsTo(Exam, {
  foreignKey: "exam_id",
});

export default Attempt;
