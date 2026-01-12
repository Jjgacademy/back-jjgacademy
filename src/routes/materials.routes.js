import { Router } from "express";
import { getMaterialsByCourse } from "../controllers/materials.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get(
  "/courses/:courseId/materials",
  authMiddleware,
  getMaterialsByCourse
);

export default router; // 🔴 ESTO ES OBLIGATORIO
