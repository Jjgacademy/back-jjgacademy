import { Router } from "express";
import {
  saveCertificate,
  getCertificateByCourse,
  downloadCertificate,
} from "../controllers/certificates.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.post("/", authMiddleware, saveCertificate);
router.get("/:courseId", authMiddleware, getCertificateByCourse);
router.get("/:courseId/download", authMiddleware, downloadCertificate);

export default router;
