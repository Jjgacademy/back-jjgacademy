import { Router } from "express";
import {
  getCommunities,
  getCommunityBySlug,
} from "../controllers/community.controller.js";
import { createCommunity } from "../controllers/community.controller.js";

const router = Router();

/* =========================
   LISTAR TODAS LAS COMUNIDADES
========================= */
router.get("/communities", getCommunities);

/* =========================
   OBTENER 1 COMUNIDAD
========================= */
router.get("/communities/:slug", getCommunityBySlug);

export default router;
