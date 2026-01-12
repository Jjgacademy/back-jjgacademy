import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token no enviado" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token mal formado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 AQUÍ SE DEFINE EL USER
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
