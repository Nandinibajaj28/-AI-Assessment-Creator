import { Question } from "@/types/assignment";

type QuestionItemProps = {
  question: Question;
  index: number;
};

export function QuestionItem({ question, index }: QuestionItemProps) {
  const difficulty = getDifficultyMeta(question.difficulty);

  return (
    <li className="text-[12px] leading-[1.85] text-[#373737] md:text-[14px] md:leading-[1.95]">
      <span className="mr-[6px]">{index}.</span>
      <span className={`rounded-[999px] px-[6px] py-[2px] text-[11px] font-medium md:text-[12px] ${difficulty.className}`}>
        [{difficulty.label}]
      </span>
      <span className="ml-[6px]">{question.text}</span>
      <span className="ml-[4px] text-[#474747]">[{question.marks} Marks]</span>
    </li>
  );
}

function getDifficultyMeta(difficulty: string) {
  const normalized = difficulty.trim().toLowerCase();

  if (normalized === "easy") {
    return {
      label: "Easy",
      className: "bg-[#eef8f1] text-[#4f7f5b]",
    };
  }

  if (normalized === "medium" || normalized === "moderate") {
    return {
      label: "Moderate",
      className: "bg-[#faf5e6] text-[#957642]",
    };
  }

  return {
    label: "Challenging",
    className: "bg-[#fbefee] text-[#a45d57]",
  };
}
