import { Router } from "express";
import { getVideosByCourse } from "../controllers/videos.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// Videos por curso
router.get("/courses/:courseId/videos", authMiddleware, getVideosByCourse);

export default router;
