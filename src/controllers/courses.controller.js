import { Course } from "../models/Course.js";
import { User } from "../models/User.js";
import Video from "../models/Video.js";
import Material from "../models/Material.js";
import UserCourse from "../models/UserCourse.js";

/* =========================
   OBTENER CURSO POR SLUG
========================= */
export const getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;

    const course = await Course.findOne({
      where: { slug },
      include: [
        { model: Video, required: false },
        { model: Material, required: false },
      ],
    });

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    // 🔥 VALIDAR SI EL USUARIO TIENE ACCESO AL CURSO
    const access = await UserCourse.findOne({
      where: {
        user_id: userId,
        course_id: course.id,
      },
    });

    if (!access) {
      return res.status(403).json({
        message: "No tienes acceso a este curso",
      });
    }

    res.json(course);

  } catch (error) {
    console.error("Error getCourseBySlug:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ASIGNAR CURSO A USUARIO
========================= */
export const assignCourse = async (req, res) => {
  try {
    const { user_id, course_id } = req.body;

    const user = await User.findByPk(user_id);
    const course = await Course.findByPk(course_id);

    if (!user || !course) {
      return res.status(404).json({
        message: "Usuario o curso no existe",
      });
    }

    await user.addCourse(course);

    res.json({ message: "Curso asignado correctamente" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER CURSOS DEL USUARIO
========================= */
export const getUserCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: {
        model: Course,
        through: { attributes: [] },
      },
    });

    res.json(user.courses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};