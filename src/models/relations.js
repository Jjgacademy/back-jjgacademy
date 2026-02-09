/* =========================
   🔹 IMPORTAR MODELOS
========================= */

import User from "./User.js";
import Course from "./Course.js";
import UserCourse from "./UserCourse.js";
import Video from "./Video.js";
import Material from "./Material.js";
import Certificate from "./Certificate.js";
import Community from "./Community.js";
import Exam from "./Exam.js";
import Question from "./Question.js";
import Attempt from "./Attempt.js";

/* =========================
   🔹 COMUNIDAD → CURSOS
========================= */

Community.hasMany(Course, {
  foreignKey: "communityId",
  as: "courses",
});

Course.belongsTo(Community, {
  foreignKey: "communityId",
  as: "community",
});

/* =========================
   🔹 USUARIOS → CURSOS
========================= */

User.belongsToMany(Course, {
  through: UserCourse,
  foreignKey: "user_id",
});

Course.belongsToMany(User, {
  through: UserCourse,
  foreignKey: "course_id",
});

/* =========================
   🔹 CURSO → VIDEOS
========================= */

Course.hasMany(Video, {
  foreignKey: "course_id",
});

Video.belongsTo(Course, {
  foreignKey: "course_id",
});

/* =========================
   🔹 CURSO → MATERIAL
========================= */

Course.hasMany(Material, {
  foreignKey: "course_id",
});

Material.belongsTo(Course, {
  foreignKey: "course_id",
});

/* =========================
   🔹 CURSO → EXAMEN
========================= */

Course.hasOne(Exam, {
  foreignKey: "course_id",
});

Exam.belongsTo(Course, {
  foreignKey: "course_id",
});

/* =========================
   🔹 EXAMEN → PREGUNTAS
========================= */

Exam.hasMany(Question, {
  foreignKey: "exam_id",
});

Question.belongsTo(Exam, {
  foreignKey: "exam_id",
});

/* =========================
   🔹 EXAMEN → INTENTOS
========================= */

Exam.hasMany(Attempt, {
  foreignKey: "exam_id",
});

Attempt.belongsTo(Exam, {
  foreignKey: "exam_id",
});

/* =========================
   🔹 USUARIO → INTENTOS
========================= */

User.hasMany(Attempt, {
  foreignKey: "user_id",
});

Attempt.belongsTo(User, {
  foreignKey: "user_id",
});

/* =========================
   🔹 CERTIFICADOS
========================= */

User.hasMany(Certificate, {
  foreignKey: "user_id",
});

Course.hasMany(Certificate, {
  foreignKey: "course_id",
});

Certificate.belongsTo(User, {
  foreignKey: "user_id",
});

Certificate.belongsTo(Course, {
  foreignKey: "course_id",
});

console.log("✅ Relaciones cargadas correctamente");
