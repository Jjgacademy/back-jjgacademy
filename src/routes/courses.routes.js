import { Router } from "express";
import { sequelize } from "../database.js";
import { QueryTypes } from "sequelize";
import bcrypt from "bcryptjs";

const router = Router();

// ---------------------------------------------------------
// 🔹 CREAR CURSO
// ---------------------------------------------------------
router.post("/create", async (req, res) => {
  const { title, slug, communityId } = req.body;

  try {
    const course = await sequelize.query(
      `INSERT INTO courses(title, slug, "communityId")
       VALUES ($1, $2, $3)
       RETURNING *`,
      {
        bind: [title, slug, communityId || 1],
        type: QueryTypes.INSERT,
      }
    );

    res.json(course[0][0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error creando curso" });
  }
});

// ---------------------------------------------------------
// 🔹 ASIGNAR CURSO MANUAL
// ---------------------------------------------------------
router.post("/assign", async (req, res) => {
  const { user_id, course_id } = req.body;

  try {
    await sequelize.query(
      `INSERT INTO user_courses(user_id, course_id)
       SELECT $1, $2
       WHERE NOT EXISTS (
         SELECT 1 FROM user_courses 
         WHERE user_id = $1 AND course_id = $2
       )`,
      { bind: [user_id, course_id] }
    );

    res.json({ ok: true, message: "Curso asignado correctamente" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error asignando curso" });
  }
});


// ---------------------------------------------------------
// 🔹 OBTENER CURSOS DEL USUARIO
// ---------------------------------------------------------
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const courses = await sequelize.query(
      `SELECT c.*
       FROM user_courses uc
       JOIN courses c ON c.id = uc.course_id
       WHERE uc.user_id = $1`,
      {
        bind: [id],
        type: QueryTypes.SELECT,
      }
    );

    res.json(courses);

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error obteniendo cursos" });
  }
});


// ---------------------------------------------------------
// 🔹 OBTENER TODOS LOS CURSOS
// ---------------------------------------------------------
router.get("/all", async (req, res) => {
  try {
    const courses = await sequelize.query(
      `SELECT * FROM courses`,
      { type: QueryTypes.SELECT }
    );

    res.json(courses);

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error obteniendo cursos" });
  }
});


// =========================================================
// 🔥 BULK AGENCIA DE VIAJES (course_id = 2)
// =========================================================
router.post("/bulk/agencia", async (req, res) => {
  const emails = req.body.emails;
  const courseId = 2;

  try {
    for (const email of emails) {

      let user = await sequelize.query(
        `SELECT id FROM users WHERE email = $1`,
        { bind: [email], type: QueryTypes.SELECT }
      );

      if (!user.length) {
        const hash = await bcrypt.hash("ACADEMY123", 10);

        const created = await sequelize.query(
          `INSERT INTO users(name,email,password,"createdAt","updatedAt")
           VALUES ($1,$2,$3,NOW(),NOW())
           RETURNING id`,
          { bind: [email.split("@")[0], email, hash], type: QueryTypes.INSERT }
        );

        user = [{ id: created[0][0].id }];
      }

      const userId = user[0].id;

      await sequelize.query(
        `INSERT INTO user_courses(user_id, course_id)
         SELECT $1, $2
         WHERE NOT EXISTS (
           SELECT 1 FROM user_courses 
           WHERE user_id = $1 AND course_id = $2
         )`,
        { bind: [userId, courseId] }
      );
    }

    res.json({ ok: true, message: "Usuarios asignados correctamente a AGENCIA DE VIAJES" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ ok: false, error: "Error en carga masiva AGENCIA" });
  }
});


// =========================================================
// 🔥 BULK TRIBUTACIÓN ISFL (course_id = 9)
// =========================================================
router.post("/bulk/isfl", async (req, res) => {
  const emails = req.body.emails;
  const courseId = 9;

  try {
    for (const email of emails) {

      let user = await sequelize.query(
        `SELECT id FROM users WHERE email = $1`,
        { bind: [email], type: QueryTypes.SELECT }
      );

      if (!user.length) {
        const hash = await bcrypt.hash("ACADEMY123", 10);

        const created = await sequelize.query(
          `INSERT INTO users(name,email,password,"createdAt","updatedAt")
           VALUES ($1,$2,$3,NOW(),NOW())
           RETURNING id`,
          { bind: [email.split("@")[0], email, hash], type: QueryTypes.INSERT }
        );

        user = [{ id: created[0][0].id }];
      }

      const userId = user[0].id;

      await sequelize.query(
        `INSERT INTO user_courses(user_id, course_id)
         SELECT $1, $2
         WHERE NOT EXISTS (
           SELECT 1 FROM user_courses 
           WHERE user_id = $1 AND course_id = $2
         )`,
        { bind: [userId, courseId] }
      );
    }

    res.json({ ok: true, message: "Usuarios asignados correctamente a TRIBUTACIÓN ISFL" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ ok: false, error: "Error en carga masiva ISFL" });
  }
});


// =========================================================
// 🔥 BULK ACTUALIZACIÓN LABORAL 20/09/2025 (course_id = 6)
// =========================================================
router.post("/bulk/actualizacion209", async (req, res) => {
  const emails = req.body.emails;
  const courseId = 6;

  try {
    for (const email of emails) {

      let user = await sequelize.query(
        `SELECT id FROM users WHERE email = $1`,
        { bind: [email], type: QueryTypes.SELECT }
      );

      if (!user.length) {
        const hash = await bcrypt.hash("ACADEMY123", 10);

        const created = await sequelize.query(
          `INSERT INTO users(name,email,password,"createdAt","updatedAt")
           VALUES ($1,$2,$3,NOW(),NOW())
           RETURNING id`,
          { bind: [email.split("@")[0], email, hash], type: QueryTypes.INSERT }
        );

        user = [{ id: created[0][0].id }];
      }

      const userId = user[0].id;

      await sequelize.query(
        `INSERT INTO user_courses(user_id, course_id)
         SELECT $1, $2
         WHERE NOT EXISTS (
           SELECT 1 FROM user_courses 
           WHERE user_id = $1 AND course_id = $2
         )`,
        { bind: [userId, courseId] }
      );
    }

    res.json({ ok: true, message: "Usuarios asignados correctamente a ACTUALIZACIÓN LABORAL 20/09/2025" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ ok: false, error: "Error en carga masiva ACTUALIZACIÓN 20/09" });
  }
});


// =========================================================
// 🔥 BULK CONTABILIDAD ISFL (course_id = 8)
// =========================================================
router.post("/bulk/contabilidadisfl", async (req, res) => {
  const emails = req.body.emails;
  const courseId = 8;

  try {
    for (const email of emails) {

      let user = await sequelize.query(
        `SELECT id FROM users WHERE email = $1`,
        { bind: [email], type: QueryTypes.SELECT }
      );

      if (!user.length) {
        const hash = await bcrypt.hash("ACADEMY123", 10);

        const created = await sequelize.query(
          `INSERT INTO users(name,email,password,"createdAt","updatedAt")
           VALUES ($1,$2,$3,NOW(),NOW())
           RETURNING id`,
          { bind: [email.split("@")[0], email, hash], type: QueryTypes.INSERT }
        );

        user = [{ id: created[0][0].id }];
      }

      const userId = user[0].id;

      await sequelize.query(
        `INSERT INTO user_courses(user_id, course_id)
         SELECT $1, $2
         WHERE NOT EXISTS (
           SELECT 1 FROM user_courses 
           WHERE user_id = $1 AND course_id = $2
         )`,
        { bind: [userId, courseId] }
      );
    }

    res.json({ ok: true, message: "Usuarios asignados correctamente a CONTABILIDAD ISFL" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ ok: false, error: "Error en carga masiva CONTABILIDAD ISFL" });
  }
});


// =========================================================
// 🔥 BULK CIERRE FISCAL (course_id = 13)
// =========================================================
router.post("/bulk/cierre", async (req, res) => {
  const emails = req.body.emails;
  const courseId = 13;

  try {
    for (const email of emails) {

      let user = await sequelize.query(
        `SELECT id FROM users WHERE email = $1`,
        { bind: [email], type: QueryTypes.SELECT }
      );

      if (!user.length) {
        const hash = await bcrypt.hash("ACADEMY123", 10);

        const created = await sequelize.query(
          `INSERT INTO users(name,email,password,"createdAt","updatedAt")
           VALUES ($1,$2,$3,NOW(),NOW())
           RETURNING id`,
          { bind: [email.split("@")[0], email, hash], type: QueryTypes.INSERT }
        );

        user = [{ id: created[0][0].id }];
      }

      const userId = user[0].id;

      await sequelize.query(
        `INSERT INTO user_courses(user_id, course_id)
         SELECT $1, $2
         WHERE NOT EXISTS (
           SELECT 1 FROM user_courses 
           WHERE user_id = $1 AND course_id = $2
         )`,
        { bind: [userId, courseId] }
      );
    }

    res.json({ ok: true, message: "Usuarios asignados correctamente a CIERRE FISCAL" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ ok: false, error: "Error en carga masiva CIERRE FISCAL" });
  }
});


// =========================================================
// 🔥 BULK ACTUALIZACIÓN LABORAL 24/10/2025 (course_id = 1)
// =========================================================
router.post("/bulk/actualizacion2410", async (req, res) => {
  const emails = req.body.emails;
  const courseId = 1;

  try {
    for (const email of emails) {

      let user = await sequelize.query(
        `SELECT id FROM users WHERE email = $1`,
        { bind: [email], type: QueryTypes.SELECT }
      );

      if (!user.length) {
        const hash = await bcrypt.hash("ACADEMY123", 10);

        const created = await sequelize.query(
          `INSERT INTO users(name,email,password,"createdAt","updatedAt")
           VALUES ($1,$2,$3,NOW(),NOW())
           RETURNING id`,
          { bind: [email.split("@")[0], email, hash], type: QueryTypes.INSERT }
        );

        user = [{ id: created[0][0].id }];
      }

      const userId = user[0].id;

      await sequelize.query(
        `INSERT INTO user_courses(user_id, course_id)
         SELECT $1, $2
         WHERE NOT EXISTS (
          SELECT 1 FROM user_courses 
          WHERE user_id = $1 AND course_id = $2
         )`,
        { bind: [userId, courseId] }
      );
    }

    res.json({ ok: true, message: "Usuarios asignados correctamente a ACTUALIZACIÓN LABORAL 24/10/2025" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ ok: false, error: "Error en carga masiva ACTUALIZACIÓN 24/10/2025" });
  }
});


// =========================================================
// 🔥 BULK ANTICIPO DE UTILIDADES (course_id = 3)
// =========================================================
router.post("/bulk/anticipo", async (req, res) => {
  const emails = req.body.emails;
  const courseId = 3;

  try {
    for (const email of emails) {

      let user = await sequelize.query(
        `SELECT id FROM users WHERE email = $1`,
        { bind: [email], type: QueryTypes.SELECT }
      );

      if (!user.length) {
        const hash = await bcrypt.hash("ACADEMY123", 10);

        const created = await sequelize.query(
          `INSERT INTO users(name,email,password,"createdAt","updatedAt")
           VALUES ($1,$2,$3,NOW(),NOW())
           RETURNING id`,
          { bind: [email.split("@")[0], email, hash], type: QueryTypes.INSERT }
        );

        user = [{ id: created[0][0].id }];
      }

      const userId = user[0].id;

      await sequelize.query(
        `INSERT INTO user_courses(user_id, course_id)
         SELECT $1, $2
         WHERE NOT EXISTS (
          SELECT 1 FROM user_courses 
          WHERE user_id = $1 AND course_id = $2
         )`,
        { bind: [userId, courseId] }
      );
    }

    res.json({ ok: true, message: "Usuarios asignados correctamente a ANTICIPO DE UTILIDADES" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ ok: false, error: "Error en carga masiva ANTICIPO" });
  }
});


// =========================================================
// 🔥 BULK IMPUESTO RENTA PN (course_id = 12)
// 👉 passwords personalizados
// =========================================================
router.post("/bulk/rentapn", async (req, res) => {
  const users = req.body.users;
  const courseId = 12;

  try {
    for (const item of users) {

      const { email, password } = item;

      let user = await sequelize.query(
        `SELECT id FROM users WHERE email = $1`,
        { bind: [email], type: QueryTypes.SELECT }
      );

      if (!user.length) {
        const hash = await bcrypt.hash(password, 10);

        const created = await sequelize.query(
          `INSERT INTO users(name,email,password,"createdAt","updatedAt")
           VALUES ($1,$2,$3,NOW(),NOW())
           RETURNING id`,
          { bind: [email.split("@")[0], email, hash], type: QueryTypes.INSERT }
        );

        user = [{ id: created[0][0].id }];
      }

      const userId = user[0].id;

      await sequelize.query(
        `INSERT INTO user_courses(user_id, course_id)
         SELECT $1, $2
         WHERE NOT EXISTS (
           SELECT 1 FROM user_courses 
           WHERE user_id = $1 AND course_id = $2
         )`,
        { bind: [userId, courseId] }
      );
    }

    res.json({ ok: true, message: "Usuarios asignados correctamente a IMPUESTO RENTA PN" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ ok: false, error: "Error en carga masiva RENTA PN" });
  }
});

// ---------------------------------------------------------
// 🔹 CURSOS POR COMUNIDAD
// ---------------------------------------------------------
router.get("/community/:communityId", async (req, res) => {
  const { communityId } = req.params;

  try {
    const courses = await sequelize.query(
      `SELECT * FROM courses WHERE "communityId" = $1`,
      {
        bind: [communityId],
        type: QueryTypes.SELECT,
      }
    );

    res.json(courses);

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error obteniendo cursos por comunidad" });
  }
});

// ---------------------------------------------------------
// 🔹 CREAR CURSO (ligado a comunidad)
// ---------------------------------------------------------
router.post("/", async (req, res) => {
  const { title, slug, communityId } = req.body;

  try {
    const result = await sequelize.query(
      `INSERT INTO courses(title, slug, "communityId")
       VALUES ($1, $2, $3)
       RETURNING *`,
      {
        bind: [title, slug, communityId || 1],
        type: QueryTypes.INSERT,
      }
    );

    res.json(result[0][0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error creando curso" });
  }
});
// ---------------------------------------------------------
// 🔹 OBTENER CURSO POR SLUG
// ---------------------------------------------------------
router.get("/slug/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const course = await sequelize.query(
      `SELECT * FROM courses WHERE slug = $1 LIMIT 1`,
      {
        bind: [slug],
        type: QueryTypes.SELECT,
      }
    );

    if (!course.length) {
      return res.status(404).json({ ok: false, error: "Curso no encontrado" });
    }

    res.json(course[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Error obteniendo curso" });
  }
});

export default router;
