import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

/* ===============================
   LOGIN (NO SE TOCA)
================================ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ message: "Error en login" });
  }
};

/* ===============================
   REGISTER (UNO POR UNO – STUDENT / ADMIN)
================================ */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hash,
      role,
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error register:", error);
    res.status(500).json({ message: "Error registrando usuario" });
  }
};

/* ===============================
   REGISTER BULK (CARGA MASIVA)
   - password: ACADEMY123
   - role: student
================================ */
export const registerBulk = async (req, res) => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: "Lista inválida" });
    }

    let created = 0;
    let skipped = 0;

    for (const u of users) {
      if (!u.email) {
        skipped++;
        continue;
      }

      const email = u.email.toLowerCase().trim();
      const name = u.name || email.split("@")[0];

      const exists = await User.findOne({ where: { email } });
      if (exists) {
        skipped++;
        continue;
      }

      const hash = await bcrypt.hash("ACADEMY123", 10);

      await User.create({
        name,
        email,
        password: hash,
        role: "student",
      });

      created++;
    }

    res.json({
      message: "Carga masiva completada",
      created,
      skipped,
      total: users.length,
    });
  } catch (error) {
    console.error("Error registerBulk:", error);
    res.status(500).json({ message: "Error en carga masiva" });
  }
};
