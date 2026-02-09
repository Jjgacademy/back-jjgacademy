import { sequelize } from "../database.js";
import { Op } from "sequelize";

import Exam from "../models/Exam.js";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";

/* =========================
   CREAR EXAMEN
========================= */
export const createExam = async (req, res) => {
  try {
    const { title, passing_score, course_id } = req.body;

    const exam = await Exam.create({
      title,
      passing_score,
      course_id,
    });

    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando examen" });
  }
};

/* =========================
   AGREGAR PREGUNTA
========================= */
export const addQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando pregunta" });
  }
};

/* =========================
   OBTENER EXAMEN COMPLETO
========================= */
export const getExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findByPk(Number(id), {
      include: [{ model: Question }],
    });

    if (!exam) {
      return res.status(404).json({ message: "Examen no encontrado" });
    }

    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo examen" });
  }
};


/* =========================
   EXAMEN RANDOM SIN REPETIR
========================= */
export const getRandomExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    // 🔒 contar intentos previos
    const attempts = await Attempt.findAll({
      where: {
        exam_id: examId,
        user_id: userId,
      },
    });

    if (attempts.length >= 2) {
      return res.status(403).json({
        message: "Máximo de intentos alcanzado",
      });
    }

    // 🔥 preguntas ya usadas
    const usadas = attempts.flatMap(a => a.preguntas_usadas || []);

    const preguntas = await Question.findAll({
      where: {
        exam_id: examId,
        id: { [Op.notIn]: usadas },
      },
      order: sequelize.random(),
      limit: 10,
      attributes: {
        exclude: ["correct_option"], // ocultar respuesta correcta
      },
    });

    if (preguntas.length < 10) {
      return res.status(400).json({
        message: "No hay suficientes preguntas nuevas",
      });
    }

    res.json(preguntas);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generando examen" });
  }
};

/* =========================
   ENVIAR EXAMEN
========================= */
export const submitExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;
    const { answers } = req.body;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({
        message: "No se enviaron respuestas",
      });
    }

    // 🔒 validar intentos
    const attempts = await Attempt.count({
      where: {
        exam_id: examId,
        user_id: userId,
      },
    });

    if (attempts >= 2) {
      return res.status(403).json({
        message: "Intentos agotados",
      });
    }

    const questionIds = Object.keys(answers).map(Number);

    const questions = await Question.findAll({
      where: {
        exam_id: examId,
        id: questionIds,
      },
    });

    let score = 0;

    for (const q of questions) {
      const userAnswer = answers[q.id];

      if (
        userAnswer?.toUpperCase().trim() ===
        q.correct_option?.toUpperCase().trim()
      ) {
        score++;
      }
    }

    // 🔥 REGLA GLOBAL: mínimo 8 para aprobar
    const aprobado = score >= 8;

    // 🔥 guardar intento
    await Attempt.create({
      exam_id: examId,
      user_id: userId,
      puntaje: score,
      aprobado,
      preguntas_usadas: questionIds,
    });

    res.json({
      score,
      aprobado,
      certificado: aprobado, // 👈 solo true si sacó 8+
      message: aprobado
        ? "Examen aprobado — puede generar certificado"
        : "Examen reprobado — no puede generar certificado",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error enviando examen" });
  }
};
