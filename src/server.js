import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./database.js";

// 🔹 RUTAS
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/courses.routes.js";
import videoRoutes from "./routes/videos.routes.js";
import materialRoutes from "./routes/materials.routes.js";
import certificateRoutes from "./routes/certificates.routes.js"; // ✅ CERTIFICADOS

// 🔹 MODELOS
import "./models/User.js";
import "./models/Course.js";
import "./models/UserCourse.js";
import "./models/Video.js";
import "./models/Material.js";
import "./models/Certificate.js"; // ✅ CERTIFICADOS

dotenv.config();

const app = express();

// 🔹 CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔹 JSON
app.use(express.json());

// 🔹 DB
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB conectada correctamente");

    await sequelize.sync();
    console.log("✅ Tablas sincronizadas");
  } catch (err) {
    console.error("❌ Error conectando BD:", err);
  }
})();

// 🔹 ENDPOINTS
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api", videoRoutes);
app.use("/api", materialRoutes);
app.use("/api/certificates", certificateRoutes); // ✅ CERTIFICADOS

// 🔹 HEALTH
app.get("/api/health", (_, res) => res.json({ ok: true }));

// 🔹 SERVER
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
