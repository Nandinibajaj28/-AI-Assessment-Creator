export type Difficulty = "easy" | "medium" | "hard";

export type Question = {
  text: string;
  difficulty: Difficulty;
  marks: number;
};

export type AssignmentSection = {
  title: string;
  instruction?: string;
  questions: Question[];
};

export type AssignmentResult = {
  sections: AssignmentSection[];
};

export type AssignmentQuestionType = {
  type: string;
  count: number;
  marks: number;
};

export type CreateAssignmentPayload = {
  schoolName: string;
  subjectName: string;
  className: string;
  timeAllowed: string;
  dueDate: string;
  questionTypes: AssignmentQuestionType[];
  numberOfQuestions: number;
  marks: number;
  instructions: string;
};

export type AssignmentDoneEvent = {
  assignmentId: string;
  result: AssignmentResult;
  schoolName: string;
  subjectName: string;
  className: string;
  timeAllowed: string;
};
