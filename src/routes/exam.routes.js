import { Router } from "express";
import {
  createExam,
  addQuestion,
  getExam,
  getRandomExam,
  submitExam,
} from "../controllers/exam.controller.js";

import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

/* =========================
   CREAR EXAMEN
========================= */
router.post("/", authMiddleware, createExam);

/* =========================
   AGREGAR PREGUNTA
========================= */
router.post("/question", authMiddleware, addQuestion);

/* =========================
   🔥 EXAMEN RANDOM
========================= */
router.get("/random/:examId", authMiddleware, getRandomExam);

/* =========================
   ENVIAR EXAMEN
========================= */
router.post("/submit/:examId", authMiddleware, submitExam);

/* =========================
   OBTENER EXAMEN POR ID
   👉 /exam/3
========================= */
router.get("/:id", authMiddleware, getExam);

export default router;
