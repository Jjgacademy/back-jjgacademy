import Exam from "./Exam.js";
import Question from "./Question.js";
import Attempt from "./Attempt.js";

export default function initModels() {
  console.log("✅ Modelos de examen inicializados:", {
    Exam: !!Exam,
    Question: !!Question,
    Attempt: !!Attempt,
  });
}
