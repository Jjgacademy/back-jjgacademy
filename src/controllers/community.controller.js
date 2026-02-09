import Community from "../models/Community.js";
import Course from "../models/Course.js";

/* =========================
   🔹 CREAR COMUNIDAD PRINCIPAL (AUTO)
========================= */
export const ensureMainCommunity = async () => {
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
   🔹 CREAR COMUNIDAD MANUAL
========================= */
export const createCommunity = async (req, res) => {
  try {
    const { nombre, slug, descripcion } = req.body;

    if (!nombre || !slug) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const exists = await Community.findOne({
      where: { slug },
    });

    if (exists) {
      return res.status(400).json({
        message: "La comunidad ya existe",
      });
    }

    const community = await Community.create({
      nombre,
      slug,
      descripcion,
    });

    res.json(community);
  } catch (error) {
    console.error("Error createCommunity:", error);
    res.status(500).json({ message: "Error creando comunidad" });
  }
};

/* =========================
   🔹 LISTAR COMUNIDADES (con cursos)
========================= */
export const getCommunities = async (req, res) => {
  try {
    const communities = await Community.findAll({
      order: [["id", "ASC"]],
      include: [
        {
          model: Course,
          as: "courses",
          required: false,
        },
      ],
    });

    res.json(communities);
  } catch (error) {
    console.error("Error getCommunities:", error);
    res.status(500).json({ message: "Error cargando comunidades" });
  }
};

/* =========================
   🔹 OBTENER 1 COMUNIDAD POR SLUG (con cursos)
========================= */
export const getCommunityBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const community = await Community.findOne({
      where: { slug },
      include: [
        {
          model: Course,
          as: "courses",
          required: false,
        },
      ],
    });

    if (!community) {
      return res.status(404).json({ message: "Comunidad no encontrada" });
    }

    res.json(community);
  } catch (error) {
    console.error("Error getCommunityBySlug:", error);
    res.status(500).json({ message: "Error cargando comunidad" });
  }
};
