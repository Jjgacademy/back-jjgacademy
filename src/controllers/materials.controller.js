import Material from "../models/Material.js";

/* =========================
   GET materiales por curso
========================= */
export const getMaterialsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const materials = await Material.findAll({
      where: { course_id: Number(courseId) },
      order: [["id", "ASC"]],
    });

    res.json(materials);

  } catch (error) {
    console.error("Error obteniendo materiales:", error);
    res.status(500).json({ message: "Error obteniendo materiales" });
  }
};

/* =========================
   CREAR material
========================= */
export const createMaterial = async (req, res) => {
  try {
    const { title, file_url, type, course_id } = req.body;

    // validación básica
    if (!title || !file_url || !course_id) {
      return res.status(400).json({
        message: "Faltan datos obligatorios (title, file_url, course_id)",
      });
    }

    const material = await Material.create({
      title,
      file_url,
      type,
      course_id: Number(course_id),
    });

    res.json(material);

  } catch (error) {
    console.error("Error creando material:", error);
    res.status(500).json({ message: "Error creando material" });
  }
};

/* =========================
   EDITAR material
========================= */
export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, file_url, type } = req.body;

    const material = await Material.findByPk(id);

    if (!material) {
      return res.status(404).json({ message: "Material no encontrado" });
    }

    await material.update({
      title,
      file_url,
      type,
    });

    res.json(material);

  } catch (error) {
    console.error("Error actualizando material:", error);
    res.status(500).json({ message: "Error actualizando material" });
  }
};

/* =========================
   ELIMINAR material
========================= */
export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const material = await Material.findByPk(id);

    if (!material) {
      return res.status(404).json({ message: "Material no encontrado" });
    }

    await material.destroy();

    res.json({ message: "Material eliminado" });

  } catch (error) {
    console.error("Error eliminando material:", error);
    res.status(500).json({ message: "Error eliminando material" });
  }
};
