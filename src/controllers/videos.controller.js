import Video from "../models/Video.js";

export const getVideosByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

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
