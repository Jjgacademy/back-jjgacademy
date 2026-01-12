import { Course } from "../models/Course.js";
import { User } from "../models/User.js";

export const assignCourse = async (req, res) => {
  try {
    const { user_id, course_id } = req.body;

    const user = await User.findByPk(user_id);
    const course = await Course.findByPk(course_id);

    if (!user || !course)
      return res.status(404).json({ message: "Usuario o curso no existe" });

    await user.addCourse(course);

    res.json({ message: "Curso asignado correctamente" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: {
        model: Course,
        through: { attributes: [] }
      }
    });

    res.json(user.courses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
