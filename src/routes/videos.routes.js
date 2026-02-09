import { Router } from "express";
import {
  getVideosByCourse,
  createVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/videos.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

/* =========================
   OBTENER VIDEOS POR CURSO
========================= */
router.get("/courses/:courseId/videos", authMiddleware, getVideosByCourse);

/* =========================
   CREAR VIDEO
========================= */
router.post("/videos", authMiddleware, createVideo);

/* =========================
   EDITAR VIDEO
========================= */
router.put("/videos/:id", authMiddleware, updateVideo);

/* =========================
   ELIMINAR VIDEO
========================= */
router.delete("/videos/:id", authMiddleware, deleteVideo);

export default router;
