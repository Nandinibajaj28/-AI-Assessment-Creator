import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";
import { AssignmentInput, normalizeAssignmentConfig } from "./prompt.service";
import {
  GeneratedAssignment,
  GeneratedQuestion,
  GeneratedSection,
  validateGeneratedAssignment,
  validateStructure
} from "../utils/validator";

type AssignmentGenerationInput = AssignmentInput;

const DEFAULT_FALLBACK_ASSIGNMENT: GeneratedAssignment = {
  sections: [
    {
      title: "Section A",
      instruction: "Attempt all questions",
      questions: [
        {
          text: "Explain one key concept stated in the extracted text with a suitable example.",
          difficulty: "easy",
          marks: 2,
          answer: "State the key concept exactly as given in the extracted text and add one suitable supporting example from the same context."
        }
      ]
    }
  ]
};

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
const EXTRACTION_FAILURE_PREFIX = "Text extraction failed:";
const FORBIDDEN_TEXT_PATTERNS = [
  /generate exactly/i,
  /question\s*1\b/i,
  /question\s*\d+\b/i,
  /question\s*\d+\s+for\s+the\s+subject/i,
  /for the subject/i,
  /placeholder/i,
  /define topic/i,
  /write something about/i
];

const toErrorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

const toDetailedErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    const errorWithCause = error as Error & { cause?: unknown };
    const cause =
      typeof errorWithCause.cause === "object" && errorWithCause.cause
        ? JSON.stringify(errorWithCause.cause)
        : errorWithCause.cause
          ? String(errorWithCause.cause)
          : "";

    return cause ? `${error.message} | cause: ${cause}` : error.message;
  }

  return String(error);
};

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in the backend environment.");
  }

  return new GoogleGenAI({ apiKey });
};

const containsForbiddenText = (value: string) =>
  FORBIDDEN_TEXT_PATTERNS.some((pattern) => pattern.test(value));

const cleanVisibleText = (value: string) =>
  value
    .split(/\r?\n/)
    .filter((line) => {
      const normalized = line.trim().toLowerCase();
      return (
        !containsForbiddenText(line) &&
        normalized !== "source line:" &&
        !normalized.startsWith("source line:")
      );
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeExtractedText = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => cleanVisibleText(line))
    .filter((line) => line.length > 0)
    .join("\n")
    .trim();

const normalizeLine = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/["'`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "this",
  "to",
  "what",
  "which",
  "who",
  "why",
  "with"
]);

const tokenizeMeaningfulWords = (value: string) =>
  normalizeLine(value)
    .split(" ")
    .filter((token) => token.length >= 4 && !STOP_WORDS.has(token));

const countSharedTokens = (left: string, right: string) => {
  const leftTokens = new Set(tokenizeMeaningfulWords(left));
  const rightTokens = new Set(tokenizeMeaningfulWords(right));

  let count = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) {
      count += 1;
    }
  }

  return count;
};

const findMatchingSourceLine = (sourceLine: string, sourceLines: string[]) => {
  const normalizedSourceLine = normalizeLine(sourceLine);
  if (!normalizedSourceLine) {
    return "";
  }

  const exactMatch = sourceLines.find((line) => normalizeLine(line) === normalizedSourceLine);
  if (exactMatch) {
    return exactMatch;
  }

  return (
    sourceLines.find((line) => {
      const normalizedLine = normalizeLine(line);
      return (
        normalizedLine.includes(normalizedSourceLine) || normalizedSourceLine.includes(normalizedLine)
      );
    }) || ""
  );
};

const isQuestionRelatedToContext = (
  questionText: string,
  sourceLine: string,
  sourceLines: string[],
  fullContext: string
) => {
  if (sourceLines.length === 0) {
    return true;
  }

  const matchedSourceLine = findMatchingSourceLine(sourceLine, sourceLines);
  if (!matchedSourceLine) {
    return false;
  }

  if (countSharedTokens(questionText, matchedSourceLine) >= 1) {
    return true;
  }

  return countSharedTokens(questionText, fullContext) >= 2;
};

const extractUploadedDocument = (data: AssignmentGenerationInput) =>
  data.uploadedFile ?? data.uploadedImage;

const extractUploadedContext = (data: AssignmentGenerationInput) =>
  [
    data.extractedText,
    data.imageText,
    data.imageDescription,
    data.imageContext,
    data.sourceText,
    data.uploadedContent,
    data.content
  ]
    .find((value) => typeof value === "string" && value.trim().length > 0)
    ?.trim() || "";

const extractGroundingLines = (value: string) => {
  const compact = value.replace(/\r/g, "\n");
  const fromLines = compact
    .split(/\n+/)
    .map((line) => cleanVisibleText(line))
    .filter((line) => line.length >= 12);

  const fromSentences = compact
    .split(/(?<=[.?!])\s+/)
    .map((line) => cleanVisibleText(line))
    .filter((line) => line.length >= 12);

  return [...fromLines, ...fromSentences].filter(
    (line, index, all) => all.findIndex((candidate) => normalizeLine(candidate) === normalizeLine(line)) === index
  );
};

const buildDifficulty = (index: number): GeneratedQuestion["difficulty"] => {
  const difficulties: GeneratedQuestion["difficulty"][] = ["easy", "medium", "hard"];
  return difficulties[index % difficulties.length];
};

const getAnswerLengthGuidance = (marks: number, difficulty: GeneratedQuestion["difficulty"]) => {
  if (marks <= 1) {
    return "Answer in one direct phrase or one short sentence.";
  }

  if (marks <= 3) {
    return difficulty === "easy"
      ? "Answer in one or two concise sentences."
      : "Answer in one or two precise explanatory sentences.";
  }

  if (marks <= 5) {
    return difficulty === "hard"
      ? "Answer in two or three well-structured sentences with key supporting points."
      : "Answer in two or three clear sentences with the main supporting detail.";
  }

  return "Answer in a short pointwise explanation that covers the main idea and supporting details from the context.";
};

const findBestSourceLineForQuestion = (questionText: string, sourceLines: string[]) => {
  let bestMatch = "";
  let bestScore = -1;

  for (const line of sourceLines) {
    const score = countSharedTokens(questionText, line);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = line;
    }
  }

  return bestScore > 0 ? bestMatch : sourceLines[0] || "";
};

const buildFallbackAnswer = ({
  questionText,
  marks,
  difficulty,
  sectionTitle,
  sourceLine,
  sourceLines,
  options
}: {
  questionText: string;
  marks: number;
  difficulty: GeneratedQuestion["difficulty"];
  sectionTitle: string;
  sourceLine?: string;
  sourceLines: string[];
  options?: string[];
}) => {
  const resolvedSourceLine =
    cleanVisibleText(sourceLine || "") || findBestSourceLineForQuestion(questionText, sourceLines);

  if (/multiple choice/i.test(sectionTitle) && options?.length) {
    const matchingOption =
      options.find((option) => normalizeLine(option) === normalizeLine(resolvedSourceLine)) ||
      options.find((option) => countSharedTokens(option, resolvedSourceLine) >= 1) ||
      options[0];

    return `Correct answer: ${matchingOption}.`;
  }

  if (!resolvedSourceLine) {
    return getAnswerLengthGuidance(marks, difficulty);
  }

  if (marks <= 2) {
    return resolvedSourceLine;
  }

  const supportingInstruction =
    difficulty === "hard"
      ? "Include the main idea and the most relevant supporting detail from the passage."
      : difficulty === "medium"
        ? "Include the main idea with one supporting detail from the passage."
        : "Keep the answer direct and based on the passage.";

  return `${resolvedSourceLine} ${supportingInstruction}`;
};

const normalizeOptions = (value: unknown) => {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const options = value
    .map((option) => String(option ?? "").trim())
    .filter((option) => option.length > 0);

  return options.length >= 3 ? options : undefined;
};

const sanitizeQuestion = (
  question: unknown,
  sectionTitle: string,
  fallbackMarks: number,
  fallbackDifficulty: GeneratedQuestion["difficulty"],
  sourceLines: string[]
): GeneratedQuestion | null => {
  if (!question || typeof question !== "object") {
    return null;
  }

  const raw = question as Record<string, unknown>;
  const text = String(raw.text ?? "").trim();
  const difficultyValue = String(raw.difficulty ?? "").trim().toLowerCase();
  const difficulty = ["easy", "medium", "hard"].includes(difficultyValue)
    ? (difficultyValue as GeneratedQuestion["difficulty"])
    : fallbackDifficulty;
  const options = normalizeOptions(raw.options);
  const marksValue = Number(raw.marks);
  const marks = Number.isFinite(marksValue) && marksValue > 0 ? marksValue : fallbackMarks;
  const answerValue = String(raw.answer ?? "").trim();

  if (!text) {
    return null;
  }

  if (/multiple choice/i.test(sectionTitle) && !options) {
    return null;
  }

  return {
    text,
    difficulty,
    marks,
    answer:
      answerValue ||
      buildFallbackAnswer({
        questionText: text,
        marks,
        difficulty,
        sectionTitle,
        sourceLines,
        options
      }),
    ...(options ? { options } : {})
  };
};

const sanitizeAssignment = (
  assignment: unknown,
  config: ReturnType<typeof normalizeAssignmentConfig>,
  sourceLines: string[]
): GeneratedAssignment => {
  if (!assignment || typeof assignment !== "object") {
    return { sections: [] };
  }

  const rawSections = Array.isArray((assignment as Record<string, unknown>).sections)
    ? ((assignment as Record<string, unknown>).sections as unknown[])
    : [];

  const sections = rawSections
    .map((section, sectionIndex) => {
      if (!section || typeof section !== "object") {
        return null;
      }

      const rawSection = section as Record<string, unknown>;
      const matchingQuestionType =
        config.questionTypes.find(
          (questionType) =>
            String(rawSection.title ?? "").trim().toLowerCase() ===
            questionType.normalizedType.trim().toLowerCase()
        ) ?? config.questionTypes[sectionIndex];

      const title = String(rawSection.title ?? "").trim() || matchingQuestionType?.normalizedType || `Section ${sectionIndex + 1}`;
      const instruction = String(rawSection.instruction ?? "").trim() || "Attempt all questions";
      const rawQuestions = Array.isArray(rawSection.questions) ? rawSection.questions : [];

      return {
        title,
        instruction,
        questions: rawQuestions
        .map((question) =>
          sanitizeQuestion(
            question,
            title,
            matchingQuestionType?.marks ?? 1,
            buildDifficulty(sectionIndex),
            sourceLines
          )
        )
        .filter((question): question is GeneratedQuestion => Boolean(question))
      };
    })
    .filter((section) => section !== null);

  return { sections };
};

const clipText = (value: string, maxLength = 120) =>
  value.length > maxLength ? `${value.slice(0, maxLength - 3).trim()}...` : value;

const toTitleCase = (value: string) =>
  value.replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

const stripLeadingNoise = (value: string) =>
  value
    .replace(/^[\s\-*•\d.)(:]+/, "")
    .replace(/\s+/g, " ")
    .trim();

const extractKeywordCandidates = (value: string) => {
  const cleaned = stripLeadingNoise(cleanVisibleText(value));
  if (!cleaned) {
    return [];
  }

  const originalWords = cleaned.split(/\s+/).filter(Boolean);
  const candidates: string[] = [];

  const leadingPhraseMatch = cleaned.match(
    /^([A-Z][a-zA-Z0-9-]*(?:\s+[A-Z]?[a-zA-Z0-9-]*){0,3})(?=\s+(?:is|are|refers|means|includes|consists|uses|contains)\b|:)/i
  );
  if (leadingPhraseMatch?.[1]) {
    candidates.push(leadingPhraseMatch[1].trim());
  }

  for (let index = 0; index < originalWords.length; index += 1) {
    const word = originalWords[index].replace(/[^a-zA-Z0-9-]/g, "");
    if (word.length < 4 || STOP_WORDS.has(word.toLowerCase())) {
      continue;
    }

    const phrase = [word];
    let nextIndex = index + 1;
    while (nextIndex < originalWords.length && phrase.length < 3) {
      const nextWord = originalWords[nextIndex].replace(/[^a-zA-Z0-9-]/g, "");
      if (nextWord.length < 4 || STOP_WORDS.has(nextWord.toLowerCase())) {
        break;
      }

      phrase.push(nextWord);
      nextIndex += 1;
    }

    candidates.push(phrase.join(" "));
  }

  return candidates.filter(
    (candidate, index, all) =>
      candidate.length >= 4 &&
      all.findIndex((value) => normalizeLine(value) === normalizeLine(candidate)) === index
  );
};

const buildFocusTerm = (sourceLine: string) => {
  const cleaned = stripLeadingNoise(cleanVisibleText(sourceLine));
  const keyword = extractKeywordCandidates(cleaned)[0];

  if (keyword) {
    return clipText(keyword, 70);
  }

  const tokens = cleaned.split(/\s+/).slice(0, 4).join(" ");
  return clipText(tokens || "the given topic", 70);
};

const buildConceptPrompt = (sourceLine: string) => {
  const cleaned = stripLeadingNoise(cleanVisibleText(sourceLine));
  if (!cleaned) {
    return "the given topic";
  }

  const withoutTerminalPunctuation = cleaned.replace(/[.?!]+$/, "").trim();
  const definitionMatch = withoutTerminalPunctuation.match(
    /^(.*?)\s+(?:is|are|refers to|means|can be defined as)\s+(.*)$/i
  );

  if (definitionMatch) {
    return clipText(definitionMatch[1].trim() || buildFocusTerm(cleaned), 90);
  }

  return buildFocusTerm(cleaned);
};

const buildReasoningPrompt = (sourceLine: string) => {
  const cleaned = stripLeadingNoise(cleanVisibleText(sourceLine));
  if (!cleaned) {
    return "the main idea presented";
  }

  const becauseMatch = cleaned.match(/\b(because|therefore|so that|thus|helps to|used to)\b\s+(.*)$/i);
  if (becauseMatch?.[2]) {
    return clipText(becauseMatch[2].replace(/[.?!]+$/, "").trim(), 90);
  }

  return clipText(cleaned.replace(/[.?!]+$/, "").trim(), 90);
};

const chooseFallbackDifficulty = (
  marks: number,
  index: number
): GeneratedQuestion["difficulty"] => {
  if (marks <= 2) {
    return index % 2 === 0 ? "easy" : "medium";
  }

  if (marks <= 5) {
    return index % 3 === 2 ? "hard" : "medium";
  }

  return "hard";
};

const buildQuestionText = ({
  difficulty,
  sourceLine,
  index
}: {
  difficulty: GeneratedQuestion["difficulty"];
  sourceLine: string;
  index: number;
}) => {
  const focusTerm = buildFocusTerm(sourceLine);
  const conceptPrompt = buildConceptPrompt(sourceLine);
  const reasoningPrompt = buildReasoningPrompt(sourceLine);

  if (difficulty === "easy") {
    const patterns = [
      `What is ${conceptPrompt}?`,
      `Define ${conceptPrompt}.`,
      `State the meaning of ${focusTerm}.`
    ];

    return patterns[index % patterns.length];
  }

  if (difficulty === "medium") {
    const patterns = [
      `Explain ${conceptPrompt}.`,
      `How does ${focusTerm} relate to ${reasoningPrompt}?`,
      `Write a short note on ${focusTerm}.`
    ];

    return patterns[index % patterns.length];
  }

  const patterns = [
    `Why is ${focusTerm} important in the given context?`,
    `How would you apply ${focusTerm} using the details provided?`,
    `Explain the significance of ${reasoningPrompt}.`
  ];

  return patterns[index % patterns.length];
};

const buildModifiedStatement = (sourceLine: string) => {
  const cleaned = stripLeadingNoise(cleanVisibleText(sourceLine));
  if (!cleaned) {
    return "An unrelated statement.";
  }

  const replacements: Array<[RegExp, string]> = [
    [/\b(increases|increase|improves|improve|supports|support|requires|require|uses|use)\b/i, "reduces"],
    [/\b(decreases|decrease|reduces|reduce|prevents|prevent)\b/i, "increases"],
    [/\b(always|all|only|must)\b/i, "sometimes"],
    [/\b(primary|main|major|key)\b/i, "minor"],
    [/\b(high|higher|maximum)\b/i, "low"],
    [/\b(low|lower|minimum)\b/i, "high"]
  ];

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(cleaned)) {
      return clipText(cleaned.replace(pattern, replacement), 96);
    }
  }

  const focusTerm = buildFocusTerm(cleaned);
  return clipText(`${focusTerm} is unrelated to the process described.`, 96);
};

const buildMixedDistractor = (sourceLine: string, sourceLines: string[]) => {
  const alternateLine = sourceLines.find(
    (line) => normalizeLine(line) !== normalizeLine(sourceLine) && buildFocusTerm(line) !== buildFocusTerm(sourceLine)
  );

  if (!alternateLine) {
    return `${toTitleCase(buildFocusTerm(sourceLine))} is described without any supporting detail.`;
  }

  return clipText(
    `${toTitleCase(buildFocusTerm(sourceLine))} is the same as ${buildFocusTerm(alternateLine)}.`,
    96
  );
};

const buildDistractors = (correctLine: string, sourceLines: string[]) => {
  const alternativeLines = sourceLines
    .filter((line) => normalizeLine(line) !== normalizeLine(correctLine))
    .map((line) => clipText(stripLeadingNoise(cleanVisibleText(line)), 96))
    .filter(Boolean);

  const distractorPool = [
    buildModifiedStatement(correctLine),
    buildMixedDistractor(correctLine, sourceLines),
    ...alternativeLines
  ];

  const distractors = distractorPool.filter(
    (option, index, all) =>
      normalizeLine(option) !== normalizeLine(correctLine) &&
      all.findIndex((candidate) => normalizeLine(candidate) === normalizeLine(option)) === index
  );

  while (distractors.length < 3) {
    distractors.push(`${toTitleCase(buildFocusTerm(correctLine))} is not mentioned in the given context.`);
  }

  return [clipText(stripLeadingNoise(cleanVisibleText(correctLine)), 96), ...distractors.slice(0, 3)];
};

const buildFallbackQuestion = ({
  sectionTitle,
  sourceLine,
  sourceLines,
  marks,
  index
}: {
  sectionTitle: string;
  sourceLine: string;
  sourceLines: string[];
  marks: number;
  index: number;
}): GeneratedQuestion => {
  const cleanedLine = stripLeadingNoise(cleanVisibleText(sourceLine));
  const fallbackLine = cleanedLine || "The topic is described in the provided content.";
  const difficulty = chooseFallbackDifficulty(marks, index);

  if (/multiple choice/i.test(sectionTitle)) {
    const options = buildDistractors(fallbackLine, sourceLines);
    const focusTerm = buildFocusTerm(fallbackLine);
    const mcqPatterns = [
      `Which of the following best describes ${focusTerm}?`,
      `Which statement is correct about ${focusTerm}?`,
      `Identify the correct statement about ${focusTerm}.`
    ];

    return {
      text: mcqPatterns[index % mcqPatterns.length],
      difficulty,
      marks,
      answer: `Correct answer: ${options[0]}.`,
      options
    };
  }

  const questionText = buildQuestionText({
    difficulty,
    sourceLine: fallbackLine,
    index
  });

  return {
    text: questionText,
    difficulty,
    marks,
    answer: buildFallbackAnswer({
      questionText,
      marks,
      difficulty,
      sectionTitle,
      sourceLine: fallbackLine,
      sourceLines
    })
  };
};

const buildGroundedFallbackAssignment = (
  data: AssignmentGenerationInput,
  sourceLinesInput?: string[]
): GeneratedAssignment => {
  const config = normalizeAssignmentConfig(data);
  const sourceLines = sourceLinesInput?.length
    ? sourceLinesInput
    : extractGroundingLines(extractUploadedContext(data));
  const usableLines =
    sourceLines.length > 0
      ? sourceLines
      : [
        cleanVisibleText(
          [
            data.subjectName && `${data.subjectName}`,
            data.additionalInfo,
            data.instructions
          ]
            .filter(Boolean)
            .join(" | ")
        ) || "The topic includes important concepts, definitions, and applications."
      ];

  if (config.questionTypes.length === 0) {
    return DEFAULT_FALLBACK_ASSIGNMENT;
  }

  return {
    sections: config.questionTypes.map<GeneratedSection>((questionType, sectionIndex) => ({
      title: questionType.normalizedType,
      instruction: "Attempt all questions",
      questions: Array.from({ length: questionType.count }, (_, index) => {
        const sourceLine = usableLines[(sectionIndex + index) % usableLines.length];
        return buildFallbackQuestion({
          sectionTitle: questionType.normalizedType,
          sourceLine,
          sourceLines: usableLines,
          marks: questionType.marks,
          index
        });
      })
    }))
  };
};

const parseDataUrlToBuffer = (dataUrl?: string) => {
  if (!dataUrl) {
    return null;
  }

  const matches = dataUrl.match(/^data:(.*?);base64,(.*)$/);
  if (!matches) {
    return null;
  }

  return {
    mimeType: matches[1],
    buffer: Buffer.from(matches[2], "base64")
  };
};

const extractTextFromPdf = async (buffer: Buffer) => {
  const parsed = await pdfParse(buffer);
  return normalizeExtractedText(parsed.text || "");
};

const extractTextFromImage = async (buffer: Buffer) => {
  const result = await Tesseract.recognize(buffer, "eng");
  return normalizeExtractedText(result.data.text || "");
};

const extractDocumentText = async (data: AssignmentGenerationInput) => {
  const uploadedDocument = extractUploadedDocument(data);
  const existingContext = extractUploadedContext(data);

  if (existingContext) {
    return existingContext;
  }

  if (!uploadedDocument?.dataUrl) {
    return "";
  }

  const parsedFile = parseDataUrlToBuffer(uploadedDocument.dataUrl);
  if (!parsedFile) {
    throw new Error(`${EXTRACTION_FAILURE_PREFIX} invalid file payload received.`);
  }

  const mimeType = uploadedDocument.mimeType || parsedFile.mimeType;

  try {
    const extractedText = mimeType === "application/pdf"
      ? await extractTextFromPdf(parsedFile.buffer)
      : await extractTextFromImage(parsedFile.buffer);

    if (mimeType === "application/pdf") {
      console.log("PDF RAW TEXT:", extractedText.slice(0, 300));
    }

    if (!extractedText) {
      throw new Error(`${EXTRACTION_FAILURE_PREFIX} no readable text was found in the uploaded file.`);
    }

    return extractedText;
  } catch (error) {
    throw new Error(`${EXTRACTION_FAILURE_PREFIX} ${toErrorMessage(error)}`);
  }
};

const buildStrictPrompt = (data: AssignmentGenerationInput, limitedText: string) => {
  const config = normalizeAssignmentConfig(data);
  const contextBlock = limitedText || "[EMPTY_CONTEXT]";

  return `
You are an expert school exam paper setter.

Context:
${contextBlock}

RULES:

- Generate questions ONLY from this context
- Use the exact extracted PDF terms, facts, definitions, processes, names, and keywords present in the context
- Do NOT use external knowledge
- Do NOT generate unrelated topics
- Do NOT refer to "uploaded material", "subject", "chapter", or similar meta wording inside questions
- Do NOT write template phrases like "related to uploaded material" or "for the subject"
- Follow question count exactly
- Keep section titles, marks, and difficulty aligned to the request
- Generate an answer key entry for every question in the "answer" field
- For Multiple Choice Questions, include at least 3 options

Return ONLY valid JSON:

{
  "sections": [
    {
      "title": "Multiple Choice Questions",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "text": "Actual academic question",
          "difficulty": "easy",
          "marks": 2,
          "answer": "Direct model answer based only on the context",
          "options": ["A", "B", "C", "D"]
        }
      ]
    }
  ]
}

Additional requirements:
- Every question must be grounded in the context block above
- Every answer must directly answer its question using only the context block above
- Turn extracted terms into natural exam questions instead of mentioning the source itself
- Prefer wording that asks about the extracted concept directly
- Keep each answer proportional to the marks and difficulty level of its question
- Answer length guide:
  - 1 mark: one direct phrase or one short sentence
  - 2 to 3 marks: one or two concise sentences
  - 4 to 5 marks: two or three clear explanatory sentences
  - 6+ marks: a short pointwise explanation with supporting details
- Create exactly ${config.questionTypes.length} sections
- Each section title must exactly match the requested question type label
- Each section instruction must be exactly "Attempt all questions"
- Total number of questions must be exactly ${config.numberOfQuestions}
- Total marks must be exactly ${config.totalMarks}
- Difficulty must be exactly one of: easy, medium, hard
- Each question object must contain a non-empty "answer" string
- ${config.questionTypes
    .map(
      (questionType) =>
        `"${questionType.normalizedType}" must contain exactly ${questionType.count} question(s), each worth ${questionType.marks} mark${
          questionType.marks === 1 ? "" : "s"
        }.`
    )
    .join("\n- ")}
`.trim();
};

const callGemini = async (prompt: string) => {
  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt
    });

    return typeof response.text === "string" ? response.text.trim() : "";
  } catch (error) {
    throw new Error(`Gemini fetch failed: ${toDetailedErrorMessage(error)}`);
  }
};

const tryParseAssignment = (
  rawText: string,
  config: ReturnType<typeof normalizeAssignmentConfig>,
  sourceLines: string[]
): GeneratedAssignment => {
  const sanitized = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    return sanitizeAssignment(JSON.parse(sanitized), config, sourceLines);
  } catch {
    const jsonSubstringMatch = sanitized.match(/\{[\s\S]*\}/);
    if (!jsonSubstringMatch) {
      throw new Error("Unable to extract JSON substring from AI response");
    }

    return sanitizeAssignment(JSON.parse(jsonSubstringMatch[0]), config, sourceLines);
  }
};

export const generateQuestions = async (data: unknown): Promise<GeneratedAssignment> => {
  const input = data as AssignmentGenerationInput;
  const uploadedDocument = extractUploadedDocument(input);
  const DEBUG_MODE = false;

  try {
    console.log("[AI] Provider selection", {
      provider: "gemini",
      model: GEMINI_MODEL
    });

    console.log("[AI] Starting grounded generation pipeline", {
      subject: input.subjectName,
      mimeType: uploadedDocument?.mimeType || "none"
    });

    let extractedText = "";
    try {
      extractedText = await extractDocumentText(input);
      console.log("EXTRACTED TEXT:", extractedText.slice(0, 200));
      console.log("========== EXTRACTION DEBUG ==========");
      console.log("File Info:", {
        hasFile: !!uploadedDocument,
        mimeType: uploadedDocument?.mimeType,
      });
      console.log("Data URL Preview:", uploadedDocument?.dataUrl?.slice(0, 100));
      console.log("Extracted Text Length:", extractedText.length);
      console.log("Extracted Text Preview:", extractedText.slice(0, 500));
      if (!extractedText) {
        console.warn("⚠️ EXTRACTION FAILED — NO TEXT FOUND");
      }
      console.log("======================================");
    } catch (extractionError) {
      const extractionMessage = toErrorMessage(extractionError);
      console.warn("[AI] Text extraction failed, proceeding with metadata only:", extractionMessage);
      // We don't throw anymore. We let it proceed to allow LLM to generate based on subject/class.
      // We can also inject a hint into the instructions.
      console.log("========== EXTRACTION DEBUG ==========");
      console.log("File Info:", {
        hasFile: !!uploadedDocument,
        mimeType: uploadedDocument?.mimeType,
      });
      console.log("Data URL Preview:", uploadedDocument?.dataUrl?.slice(0, 100));
      console.log("Extracted Text Length:", extractedText.length);
      console.log("Extracted Text Preview:", extractedText.slice(0, 500));
      console.warn("⚠️ EXTRACTION FAILED — NO TEXT FOUND");
      console.log("======================================");
    }

    if (DEBUG_MODE) {
      console.log("[AI DEBUG MODE] Extracted content:", extractedText || "NO TEXT EXTRACTED");
    }

    const preparedInput: AssignmentGenerationInput = {
      ...input,
      extractedText:
        extractedText ||
        input.additionalInfo ||
        input.instructions ||
        ""
    };

    const limitedText = (preparedInput.extractedText || "").slice(0, 2000);
    const sourceLines = extractGroundingLines(limitedText);

    const prompt = buildStrictPrompt(preparedInput, limitedText);
    const rawResponse = await callGemini(prompt);

    console.log("[AI DEBUG]", {
      extractedText: preparedInput.extractedText,
      prompt,
      rawResponse
    });

    if (!rawResponse) {
      throw new Error("LLM response content was empty");
    }

    const config = normalizeAssignmentConfig(preparedInput);
    const parsed = tryParseAssignment(rawResponse, config, sourceLines);

    validateStructure(parsed);
    return parsed;
  } catch (error) {
    const message = toErrorMessage(error);
    console.error("[AI] Grounded generation failed", message);

    try {
      const fallback = buildGroundedFallbackAssignment(input);
      validateStructure(fallback);
      return validateGeneratedAssignment(fallback, normalizeAssignmentConfig(input));
    } catch (fallbackError) {
      console.error("[AI] Fallback generation failed", toErrorMessage(fallbackError));
      return DEFAULT_FALLBACK_ASSIGNMENT;
    }
  }
};
