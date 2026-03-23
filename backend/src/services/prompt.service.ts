export type Difficulty = "easy" | "medium" | "hard";

export type AssignmentQuestionTypeInput = {
  type?: string;
  count?: number;
  marks?: number;
};

export type AssignmentInput = {
  questionTypes?: AssignmentQuestionTypeInput[] | string[] | string;
  numberOfQuestions?: number;
  marks?: number;
  instructions?: string;
  dueDate?: string;
  schoolName?: string;
  subjectName?: string;
  className?: string;
  timeAllowed?: string;
};

export type StrictQuestionType = {
  requestedType: string;
  normalizedType: string;
  count: number;
  marks: number;
};

export type StrictAssignmentConfig = {
  questionTypes: StrictQuestionType[];
  numberOfQuestions: number;
  totalMarks: number;
  instructions: string;
  dueDate: string;
  schoolName: string;
  subjectName: string;
  className: string;
  timeAllowed: string;
};

const TYPE_LABELS: Record<string, string> = {
  mcq: "Multiple Choice Questions",
  "multiple choice questions": "Multiple Choice Questions",
  "multiple choice question": "Multiple Choice Questions",
  multiplechoicequestions: "Multiple Choice Questions",
  short: "Short Answer Questions",
  "short answer questions": "Short Answer Questions",
  "short answer question": "Short Answer Questions",
  shortquestions: "Short Answer Questions",
  "short questions": "Short Answer Questions",
  long: "Long Answer Questions",
  "long answer questions": "Long Answer Questions",
  "long answer question": "Long Answer Questions",
  longquestions: "Long Answer Questions",
  "long questions": "Long Answer Questions",
  numerical: "Numerical Problems",
  "numerical problems": "Numerical Problems",
  "numerical problem": "Numerical Problems",
  numericalproblems: "Numerical Problems",
  "diagram/graph-based questions": "Diagram/Graph-Based Questions",
  "diagram graph based questions": "Diagram/Graph-Based Questions",
  diagramgraphbasedquestions: "Diagram/Graph-Based Questions"
};

const normalizeTypeKey = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z]+/g, " ").trim();

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getNormalizedType = (value: string) => {
  const direct = TYPE_LABELS[normalizeTypeKey(value)];
  if (direct) return direct;

  const collapsed = normalizeTypeKey(value).replace(/\s+/g, "");
  return TYPE_LABELS[collapsed] ?? value.trim();
};

const normalizeQuestionTypes = (
  questionTypes: AssignmentInput["questionTypes"]
): StrictQuestionType[] => {
  if (!Array.isArray(questionTypes)) {
    return [];
  }

  return questionTypes
    .map((questionType) => {
      if (typeof questionType === "string") {
        const normalizedType = getNormalizedType(questionType);
        return {
          requestedType: questionType,
          normalizedType,
          count: 0,
          marks: 0
        };
      }

      const requestedType = String(questionType.type ?? "").trim();
      const normalizedType = getNormalizedType(requestedType || "General");

      return {
        requestedType: requestedType || normalizedType,
        normalizedType,
        count: toNumber(questionType.count),
        marks: toNumber(questionType.marks)
      };
    })
    .filter((questionType) => questionType.normalizedType.length > 0);
};

export const normalizeAssignmentConfig = (data: AssignmentInput): StrictAssignmentConfig => {
  const questionTypes = normalizeQuestionTypes(data.questionTypes);
  const numberOfQuestions =
    questionTypes.reduce((sum, questionType) => sum + questionType.count, 0) ||
    toNumber(data.numberOfQuestions);
  const totalMarks =
    questionTypes.reduce((sum, questionType) => sum + questionType.count * questionType.marks, 0) ||
    toNumber(data.marks);

  return {
    questionTypes,
    numberOfQuestions,
    totalMarks,
    instructions: String(data.instructions ?? "").trim(),
    dueDate: String(data.dueDate ?? "").trim(),
    schoolName: String(data.schoolName ?? "").trim(),
    subjectName: String(data.subjectName ?? "").trim(),
    className: String(data.className ?? "").trim(),
    timeAllowed: String(data.timeAllowed ?? "").trim()
  };
};

const buildTypeInstructions = (config: StrictAssignmentConfig) =>
  config.questionTypes
    .map(
      (questionType, index) =>
        `${index + 1}. ${questionType.count} ${questionType.normalizedType} (${questionType.marks} mark${
          questionType.marks === 1 ? "" : "s"
        } each)`
    )
    .join("\n");

const buildSectionSchema = (config: StrictAssignmentConfig) =>
  config.questionTypes
    .map(
      (questionType) => `    {
      "title": "${questionType.normalizedType}",
      "instruction": "Generate exactly ${questionType.count} ${questionType.normalizedType.toLowerCase()}",
      "questions": [
        {
          "text": "string",
          "difficulty": "easy | medium | hard",
          "marks": ${questionType.marks}
        }
      ]
    }`
    )
    .join(",\n");

export const buildPrompt = (data: AssignmentInput): string => {
  const config = normalizeAssignmentConfig(data);
  const strictInstructions = buildTypeInstructions(config);
  const extraInstructions = config.instructions || "No extra instructions.";

  return `
You are an exam generator that must follow the requested configuration exactly.
Return only one valid JSON object.
Do not return markdown fences.
Do not return explanation text.
Do not add extra sections.
Do not add extra questions.
Do not change counts.
Do not change marks.
Do not invent question types.

Generate exactly:
${strictInstructions}

Rules:
- Create exactly ${config.questionTypes.length} sections.
- Each section title must exactly match the requested question type label.
- Put questions only inside the matching section for that type.
- Each question must contain: text, difficulty, marks.
- Difficulty must be exactly one of: easy, medium, hard.
- Every question in a section must use that section's required marks.
- ${config.questionTypes
    .map(
      (questionType) =>
        `"${questionType.normalizedType}" must contain exactly ${questionType.count} question(s), each worth ${questionType.marks} mark${
          questionType.marks === 1 ? "" : "s"
        }.`
    )
    .join("\n- ")}
- Total number of questions must be exactly ${config.numberOfQuestions}.
- Total marks must be exactly ${config.totalMarks}.
- Use a deterministic spread of difficulty values across the generated questions.
- Keep the output strictly aligned to the requested school, class, subject, and instructions when relevant.

Required output schema:
{
  "sections": [
${buildSectionSchema(config)}
  ]
}

Assignment context:
- School Name: ${config.schoolName || "Not specified"}
- Subject: ${config.subjectName || "Not specified"}
- Class: ${config.className || "Not specified"}
- Time Allowed: ${config.timeAllowed || "Not specified"}
- Due Date: ${config.dueDate || "Not specified"}
- Additional Instructions: ${extraInstructions}
`.trim();
};
