import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = Router();

/* =========================
      REGISTRO
========================= */
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Verificar si ya existe
    const exists = await User.findOne({ where: { email } });
    if (exists)
      return res.status(400).json({ message: "Correo ya registrado" });

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password: hash,      // 👈 GUARDAMOS EN password
      role: role || "student"
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error servidor" });
  }
});

/* =========================
        LOGIN
========================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(400).json({ message: "Credenciales incorrectas" });

    // Comparar contraseña
    const valid = await bcrypt.compare(password, user.password);  // 👈 password correcto

    if (!valid)
      return res.status(400).json({ message: "Credenciales incorrectas" });

    // Crear token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error servidor" });
  }
});

export default router;
