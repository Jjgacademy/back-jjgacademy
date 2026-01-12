import Material from "../models/Material.js";

export const getMaterialsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const materials = await Material.findAll({
      where: { course_id: courseId },
      order: [["id", "ASC"]],
    });

    res.json(materials);
  } catch (error) {
    console.error("Error obteniendo materiales:", error);
    res.status(500).json({ message: "Error obteniendo materiales" });
  }
};
