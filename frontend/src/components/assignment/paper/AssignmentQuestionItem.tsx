import { Badge } from "@/components/ui/Badge";
import { Question } from "@/types/assignment";

type AssignmentQuestionItemProps = {
  question: Question;
  index: number;
};

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "bg-[#ecfdf3] text-[#166534] border-[#bbf7d0]",
  medium: "bg-[#fffbeb] text-[#a16207] border-[#fde68a]",
  hard: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]"
};

export function AssignmentQuestionItem({ question, index }: AssignmentQuestionItemProps) {
  const difficultyKey = question.difficulty.toLowerCase();
  const badgeClass = DIFFICULTY_STYLES[difficultyKey] || DIFFICULTY_STYLES.easy;

  return (
    <li className="rounded-[16px] border border-[#ececec] bg-[#fcfcfc] px-[14px] py-[12px] text-[12px] leading-[1.85] text-[#373737] md:px-[16px] md:text-[14px] md:leading-[1.95]">
      <div className="flex flex-wrap items-center gap-[8px]">
        <span className="font-semibold text-[#202020]">{index}.</span>
        <span className="flex-1 text-[#2f2f2f]">{question.text}</span>
        <Badge className={`border font-semibold uppercase tracking-[0.08em] ${badgeClass}`}>
          {question.difficulty}
        </Badge>
        <Badge className="bg-[#f3f4f6] text-[#374151]">
          {question.marks} mark{question.marks === 1 ? "" : "s"}
        </Badge>
      </div>

      {Array.isArray(question.options) && question.options.length > 0 ? (
        <ul className="mt-[10px] space-y-[6px] pl-[24px] text-[11px] text-[#4b5563] md:text-[13px]">
          {question.options.map((option, optionIndex) => (
            <li key={`${question.text}-${optionIndex}`} className="list-[upper-alpha]">
              <span>{option}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-[10px] rounded-[12px] bg-[#f5f7fb] px-[10px] py-[8px] text-[10px] leading-[1.5] text-[#516074] md:text-[11px]">
        Source line: {question.sourceLine}
      </p>
    </li>
  );
}
