import { Router } from "express";
import {
  getMaterialsByCourse,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "../controllers/materials.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

/* =========================
   GET materiales por curso
========================= */
router.get(
  "/courses/:courseId/materials",
  authMiddleware,
  getMaterialsByCourse
);

/* =========================
   CREAR material
========================= */
router.post("/materials", authMiddleware, createMaterial);

/* =========================
   EDITAR material
========================= */
router.put("/materials/:id", authMiddleware, updateMaterial);

/* =========================
   ELIMINAR material
========================= */
router.delete("/materials/:id", authMiddleware, deleteMaterial);

export default router;
