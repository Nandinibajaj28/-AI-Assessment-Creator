import { buildPrompt, normalizeAssignmentConfig } from "./prompt.service";
import {
  GeneratedAssignment,
  GeneratedQuestion,
  GeneratedSection,
  validateGeneratedAssignment,
  validateStructure
} from "./validator";

const OLLAMA_URL = "http://127.0.0.1:11434/api/generate";
const OLLAMA_MODEL = "llama3";

const DEFAULT_FALLBACK_ASSIGNMENT: GeneratedAssignment = {
  sections: [
    {
      title: "Section A",
      instruction: "Attempt all questions",
      questions: [
        {
          text: "Explain Artificial Intelligence.",
          difficulty: "easy",
          marks: 2
        }
      ]
    }
  ]
};

const toErrorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

const sanitizeOllamaResponse = (content: string) =>
  content
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

const buildStrictPrompt = (data: Parameters<typeof buildPrompt>[0]) => `
${buildPrompt(data)}

Return ONLY valid JSON.
Do not include explanation.
Do not include markdown.
`.trim();

const normalizeQuestionText = (questionType: string, index: number, subjectName: string) => {
  const subject = subjectName || "the subject";
  return `${questionType} question ${index + 1} for ${subject}.`;
};

const buildDifficulty = (index: number): GeneratedQuestion["difficulty"] => {
  const difficulties: GeneratedQuestion["difficulty"][] = ["easy", "medium", "hard"];
  return difficulties[index % difficulties.length];
};

const buildFallbackAssignment = (
  data: Parameters<typeof normalizeAssignmentConfig>[0]
): GeneratedAssignment => {
  const config = normalizeAssignmentConfig(data);

  if (config.questionTypes.length === 0) {
    return DEFAULT_FALLBACK_ASSIGNMENT;
  }

  return {
    sections: config.questionTypes.map<GeneratedSection>((questionType) => ({
      title: questionType.normalizedType,
      instruction: `Generate exactly ${questionType.count} ${questionType.normalizedType.toLowerCase()}.`,
      questions: Array.from({ length: questionType.count }, (_, index) => ({
        text: normalizeQuestionText(questionType.normalizedType, index, config.subjectName),
        difficulty: buildDifficulty(index),
        marks: questionType.marks
      }))
    }))
  };
};

const hasNonEmptyQuestions = (assignment: GeneratedAssignment) =>
  assignment.sections.length > 0 &&
  assignment.sections.every(
    (section) => Array.isArray(section.questions) && section.questions.length > 0
  );

const tryParseAssignment = (rawText: string): GeneratedAssignment => {
  const sanitized = sanitizeOllamaResponse(rawText);

  console.log("[AI] JSON parsing started");

  try {
    const parsed = JSON.parse(sanitized);
    validateStructure(parsed);
    if (!hasNonEmptyQuestions(parsed)) {
      throw new Error("Parsed assignment contains empty sections");
    }
    console.log("[AI] Parsing success");
    return parsed;
  } catch (error) {
    console.log("[AI] Initial parse failed", toErrorMessage(error));
  }

  const jsonSubstringMatch = sanitized.match(/\{[\s\S]*\}/);
  if (!jsonSubstringMatch) {
    throw new Error("Unable to extract JSON substring from AI response");
  }

  console.log("[AI] Retrying JSON parsing with extracted substring");
  try {
    const parsed = JSON.parse(jsonSubstringMatch[0]);
    validateStructure(parsed);
    if (!hasNonEmptyQuestions(parsed)) {
      throw new Error("Parsed assignment contains empty sections");
    }
    console.log("[AI] Parsing success");
    return parsed;
  } catch (error) {
    console.log("[AI] Regex parse failed", toErrorMessage(error));
    throw error;
  }
};

export const generateQuestions = async (data: unknown): Promise<GeneratedAssignment> => {
  const configInput = data as Parameters<typeof normalizeAssignmentConfig>[0];
  const config = normalizeAssignmentConfig(configInput);
  const fallback = buildFallbackAssignment(configInput);

  try {
    console.log("[AI] Calling Ollama", { url: OLLAMA_URL, model: OLLAMA_MODEL });

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: buildStrictPrompt(data as Parameters<typeof buildPrompt>[0]),
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed with status ${response.status}`);
    }

    const result = (await response.json()) as { response?: string };
    console.log("[AI] Ollama response received");

    if (typeof result.response !== "string" || result.response.trim().length === 0) {
      throw new Error("Ollama response content was empty");
    }

    const parsed = tryParseAssignment(result.response);
    const validated = validateGeneratedAssignment(parsed, config);

    if (!hasNonEmptyQuestions(validated)) {
      throw new Error("Validated assignment contains empty sections");
    }

    console.log("[AI] Parsing success");
    return validated;
  } catch (error) {
    console.error("[AI] Fallback used", toErrorMessage(error));

    try {
      validateStructure(fallback);

      if (!hasNonEmptyQuestions(fallback)) {
        throw new Error("Fallback assignment contains empty sections");
      }

      if (config.questionTypes.length > 0) {
        return validateGeneratedAssignment(fallback, config);
      }

      return fallback;
    } catch (fallbackError) {
      console.error("[AI] Configured fallback validation failed", toErrorMessage(fallbackError));
      return DEFAULT_FALLBACK_ASSIGNMENT;
    }
  }
};
