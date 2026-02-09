import Question from "../models/Question.js";

async function seed() {
  await Question.bulkCreate([
    {
      text: "¿Qué es el IVA?",
      options: ["Impuesto", "Cuenta bancaria", "Factura", "Empresa"],
      correct: 0,
    },
    {
      text: "¿Quién regula impuestos en Ecuador?",
      options: ["SRI", "IESS", "Municipio", "Banco"],
      correct: 0,
    },
    {
      text: "¿Qué es una factura?",
      options: ["Documento legal", "Contrato", "Impuesto", "Cuenta"],
      correct: 0,
    },
    {
      text: "¿Qué significa ATS?",
      options: ["Anexo Transaccional", "Sistema Bancario", "Tributo", "Ley"],
      correct: 0,
    },
  ]);

  console.log("✅ Preguntas insertadas");
  process.exit();
}

seed();
