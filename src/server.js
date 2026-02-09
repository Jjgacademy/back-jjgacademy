import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./database.js";

dotenv.config();

const app = express();

/* =========================
   🔹 MODELOS BASE
========================= */

import "./models/User.js";
import "./models/Course.js";
import "./models/UserCourse.js";
import "./models/Video.js";
import "./models/Material.js";
import "./models/Certificate.js";
import Community from "./models/Community.js";
import communityRoutes from "./routes/community.routes.js";

/* =========================
   🔹 MODELOS EXAMEN
========================= */

import initModels from "./models/initModels.js";
initModels();

/* =========================
   🔹 RELACIONES
========================= */

import "./models/relations.js";

/* =========================
   🔹 DEBUG INFO
========================= */

console.log("Modelos cargados:", Object.keys(sequelize.models));
console.log("DB usada:", sequelize.config.database);

/* =========================
   🔹 FUNCIÓN: comunidad principal
========================= */

const ensureMainCommunity = async () => {
  const exists = await Community.findOne({
    where: { slug: "jjgacademy" },
  });

  if (!exists) {
    await Community.create({
      nombre: "JJGACADEMY",
      slug: "jjgacademy",
      descripcion: "Comunidad principal de JJG Academy",
      esPrincipal: true,
    });

    console.log("✅ Comunidad JJGACADEMY creada automáticamente");
  } else {
    console.log("ℹ️ Comunidad principal ya existe");
  }
};

/* =========================
   🔹 RUTAS
========================= */

import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/courses.routes.js";
import videoRoutes from "./routes/videos.routes.js";
import materialRoutes from "./routes/materials.routes.js";
import certificateRoutes from "./routes/certificates.routes.js";
import examRoutes from "./routes/exam.routes.js";

/* =========================
   🔹 MIDDLEWARES
========================= */

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


// soporte JSON grande
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   🔹 DB CONEXIÓN
========================= */

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB conectada correctamente");

    // ⚠️ sincronizar solo en desarrollo
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync();
      console.log("✅ Tablas sincronizadas");
    }

    await ensureMainCommunity();
  } catch (err) {
    console.error("❌ Error conectando BD:", err);
  }
})();

/* =========================
   🔹 ENDPOINTS
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api", videoRoutes);
app.use("/api", materialRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/exam", examRoutes);
app.use("/api", communityRoutes);

app.get("/api/health", (_, res) => res.json({ ok: true }));

/* =========================
   🔹 SERVER
========================= */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
