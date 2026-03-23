import { AssignmentSection } from "@/types/assignment";
import { QuestionItem } from "./QuestionItem";

type SectionBlockProps = {
  section: AssignmentSection;
  startIndex: number;
};

export function SectionBlock({ section, startIndex }: SectionBlockProps) {
  const instruction =
    typeof section.instruction === "string" && !/generate exactly/i.test(section.instruction)
      ? section.instruction.trim()
      : "Attempt all questions";

  return (
    <section>
      <h2 className="text-center text-[18px] font-medium tracking-[-0.03em] text-[#2b2b2b] md:text-[30px]">
        {section.title}
      </h2>

      {instruction ? (
        <div className="mt-[18px] md:mt-[26px]">
          <p className="text-[13px] font-medium text-[#2f2f2f] md:text-[15px]">{instruction}</p>
        </div>
      ) : null}

      <ol className="mt-[20px] space-y-[12px] md:mt-[26px] md:space-y-[14px]">
        {section.questions.map((question, index) => (
          <QuestionItem key={`${section.title}-${index}-${question.text}`} question={question} index={startIndex + index} />
        ))}
      </ol>
    </section>
  );
}
