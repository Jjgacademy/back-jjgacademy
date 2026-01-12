import Certificate from "../models/Certificate.js";
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/* ===============================
   GUARDAR CERTIFICADO (1 SOLA VEZ)
================================ */
export const saveCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { course_id, full_name, city } = req.body;

    if (!userId || !course_id || !full_name) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const exists = await Certificate.findOne({
      where: { user_id: userId, course_id },
    });

    if (exists) {
      return res.status(400).json({
        message: "El certificado ya fue registrado",
      });
    }

    let pdfPath = "";
    let certCity = null;

    // 👉 CIERRE FISCAL (ID = 13)
    if (Number(course_id) === 13) {
      if (!city) {
        return res.status(400).json({ message: "Ciudad requerida" });
      }
      pdfPath = `/certificados/${city}.pdf`;
      certCity = city;
    }

    // 👉 AGENCIA DE VIAJES (ID = 2)
    else if (Number(course_id) === 2) {
      pdfPath = `/certificados/viajes.pdf`;
      certCity = "quito";
    }

    // 👉 IMPUESTO RENTA PN (ID = 12)
    else if (Number(course_id) === 12) {
      pdfPath = `/certificados/impuesto_renta.pdf`;
      certCity = "quito";
    }

    // 👉 CONSTRUCCIÓN (ID = 11)
    else if (Number(course_id) === 11) {
      pdfPath = `/certificados/construccion.pdf`;
      certCity = "quito";
    }

    // 👉 NIIF 16 (ID = 10) ✅ NUEVO
    else if (Number(course_id) === 10) {
      pdfPath = `/certificados/niff16.pdf`;
      certCity = "quito";
    }

    // 👉 OTROS (NO CONFIGURADOS)
    else {
      return res.status(400).json({
        message: "Curso no configurado para certificados",
      });
    }

    const cert = await Certificate.create({
      user_id: userId,
      course_id,
      full_name,
      city: certCity,
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
   DESCARGAR CERTIFICADO
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

    // 🔹 DEFINIR PDF SEGÚN CURSO
    let pdfFile = "";

    if (Number(courseId) === 13) {
      pdfFile = `${cert.city}.pdf`;
    } 
    else if (Number(courseId) === 2) {
      pdfFile = "viajes.pdf";
    } 
    else if (Number(courseId) === 12) {
      pdfFile = "impuesto_renta.pdf";
    }
    else if (Number(courseId) === 11) {
      pdfFile = "construccion.pdf";
    }
    else if (Number(courseId) === 10) {
      pdfFile = "niff16.pdf"; // ✅ NUEVO
    }
    else {
      return res.status(400).json({
        message: "Certificado no configurado para este curso",
      });
    }

    const basePdfPath = path.join(
      process.cwd(),
      "src/assets/certificados",
      pdfFile
    );

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
      `attachment; filename="certificado.pdf"`
    );

    res.send(Buffer.from(finalPdf));
  } catch (error) {
    console.error("Error downloadCertificate:", error);
    res.status(500).json({ message: "Error descargando certificado" });
  }
};
