import Certificate from "../models/Certificate.js";
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import Attempt from "../models/Attempt.js";
import Exam from "../models/Exam.js";

/* ===============================
   GUARDAR CERTIFICADO (1 SOLA VEZ)
================================ */
export const saveCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { course_id, full_name } = req.body;
    /* 🔒 VALIDAR EXAMEN APROBADO */
    const aprobado = await Attempt.findOne({
      where: {
        user_id: userId,
        aprobado: true,
      },
      include: {
        model: Exam,
        where: { course_id },
      },
    });

    if (!aprobado) {
      return res.status(403).json({
        message: "Debe aprobar el examen para generar certificado",
      });
    }

    if (!userId || !course_id || !full_name) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    // ❌ Evitar duplicados
    const exists = await Certificate.findOne({
      where: { user_id: userId, course_id },
    });

    if (exists) {
      return res.status(400).json({
        message: "El certificado ya fue registrado",
      });
    }

    let pdfPath = "";

    if (Number(course_id) === 1) {
      pdfPath = "certificados/anexo_rebefics.pdf";
    } else {
      return res.status(400).json({
        message: "Este curso no tiene certificado configurado",
      });
    }

    /* ===== MAPEO CURSO → PDF ===== */

    const cert = await Certificate.create({
      user_id: userId,
      course_id,
      full_name,
      pdf_path: pdfPath,
    });

    res.json(cert);
  } catch (error) {
    console.error("Error saveCertificate:", error);
    res.status(500).json({ message: "Error guardando certificado" });
  }
};

/* ===============================
   OBTENER CERTIFICADO
================================ */
export const getCertificateByCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const cert = await Certificate.findOne({
      where: { user_id: userId, course_id: courseId },
    });

    res.json(cert);
  } catch (error) {
    console.error("Error getCertificateByCourse:", error);
    res.status(500).json({ message: "Error obteniendo certificado" });
  }
};

/* ===============================
   DESCARGAR CERTIFICADO (FIX REAL)
================================ */
export const downloadCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const cert = await Certificate.findOne({
      where: { user_id: userId, course_id: courseId },
    });

    if (!cert) {
      return res.status(404).json({ message: "Certificado no encontrado" });
    }

    if (!cert.pdf_path) {
      return res.status(400).json({
        message: "Certificado no configurado para este curso",
      });
    }

    // ✅ RUTA CORRECTA (AQUÍ ESTABA EL ERROR)
    const basePdfPath = path.join(
      process.cwd(),
      "src",
      "assets",
      cert.pdf_path,
    );

    if (!fs.existsSync(basePdfPath)) {
      console.error("PDF no existe:", basePdfPath);
      return res.status(404).json({
        message: "Archivo de certificado no encontrado",
      });
    }

    const pdfBytes = fs.readFileSync(basePdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const page = pdfDoc.getPages()[0];
    const { width } = page.getSize();

    const text = cert.full_name.toUpperCase();
    const fontSize = 28;
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    const x = (width - textWidth) / 2;
    const y = 360;

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    const finalPdf = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="certificado.pdf"',
    );

    res.send(Buffer.from(finalPdf));
  } catch (error) {
    console.error("Error downloadCertificate:", error);
    res.status(500).json({ message: "Error descargando certificado" });
  }
};
