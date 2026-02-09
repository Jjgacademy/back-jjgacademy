import { Router } from "express";
import {
  login,
  register,
  registerBulk,
} from "../controllers/auth.controller.js";

const router = Router();

/* =========================
   AUTH ROUTES
========================= */

router.post("/login", login);
router.post("/register", register);
router.post("/register-bulk", registerBulk);

export default router;
