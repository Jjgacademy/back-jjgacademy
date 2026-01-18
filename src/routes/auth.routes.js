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
    const exists = await User.findOne({ where: { email } });
    if (exists)
      return res.status(400).json({ message: "Correo ya registrado" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role: role || "student",
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error servidor" });
  }
});

/* =========================
   REGISTRO MASIVO (NUEVO)
========================= */
router.post("/register-bulk", async (req, res) => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users)) {
      return res.status(400).json({ message: "Formato inválido" });
    }

    let inserted = 0;
    const insertedEmails = [];

    for (const u of users) {
      if (!u.email || !u.password) continue;

      const exists = await User.findOne({ where: { email: u.email } });
      if (exists) continue;

      const hash = await bcrypt.hash(u.password, 10);

      await User.create({
        name: u.name || "Student",
        email: u.email.toLowerCase().trim(),
        password: hash,
        role: "student",
      });

      inserted++;
      insertedEmails.push(u.email);
    }

    res.json({
      inserted,
      users: insertedEmails,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registro masivo" });
  }
});

/* =========================
        LOGIN
========================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(400).json({ message: "Credenciales incorrectas" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return res.status(400).json({ message: "Credenciales incorrectas" });

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
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error servidor" });
  }
});

export default router;
