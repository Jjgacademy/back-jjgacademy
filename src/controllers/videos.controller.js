import Video from "../models/Video.js";

/* =========================
   GET videos por curso
========================= */
export const getVideosByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 🔥 PROTECCIÓN
    if (!courseId || isNaN(courseId)) {
      return res.status(400).json({
        message: "courseId inválido",
      });
    }

    const videos = await Video.findAll({
      where: { course_id: courseId },
      order: [["orden", "ASC"]],
    });

    res.json(videos);
  } catch (error) {
    console.error("Error obteniendo videos:", error);
    res.status(500).json({ message: "Error obteniendo videos" });
  }
};

/* =========================
   CREAR video
========================= */
export const createVideo = async (req, res) => {
  try {
    const { title, url, orden, course_id } = req.body;

    if (!title || !url || !course_id || orden == null) {
      return res.status(400).json({
        message: "Faltan datos obligatorios (title, url, course_id, orden)",
      });
    }

    const video = await Video.create({
      title,
      video_url: url,
      orden,
      course_id,
    });

    res.json(video);

  } catch (error) {
    console.error("Error creando video:", error);
    res.status(500).json({ message: "Error creando video" });
  }
};


/* =========================
   EDITAR video
========================= */
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, orden } = req.body;

    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ message: "Video no encontrado" });
    }

    await video.update({
      title,
      video_url: url,
      orden,
    });

    res.json(video);
  } catch (error) {
    console.error("Error actualizando video:", error);
    res.status(500).json({ message: "Error actualizando video" });
  }
};

/* =========================
   ELIMINAR video
========================= */
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ message: "Video no encontrado" });
    }

    await video.destroy();

    res.json({ message: "Video eliminado" });
  } catch (error) {
    console.error("Error eliminando video:", error);
    res.status(500).json({ message: "Error eliminando video" });
  }
};
