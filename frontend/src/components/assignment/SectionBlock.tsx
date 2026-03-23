import { AssignmentSection } from "@/types/assignment";
import { QuestionItem } from "./QuestionItem";

type SectionBlockProps = {
  section: AssignmentSection;
  startIndex: number;
};

export function SectionBlock({ section, startIndex }: SectionBlockProps) {
  return (
    <section>
      <h2 className="text-center text-[18px] font-medium tracking-[-0.03em] text-[#2b2b2b] md:text-[30px]">
        {section.title}
      </h2>

      {section.instruction ? (
        <div className="mt-[18px] md:mt-[26px]">
          <p className="text-[13px] font-medium text-[#2f2f2f] md:text-[15px]">{section.instruction}</p>
          <p className="mt-[3px] text-[11px] italic text-[#5d5d5d] md:text-[13px]">
            Attempt all questions. Each question carries 2 marks
          </p>
        </div>
      ) : null}

      <ol className="mt-[20px] space-y-[10px] md:mt-[26px] md:space-y-[11px]">
        {section.questions.map((question, index) => (
          <QuestionItem key={`${section.title}-${index}-${question.text}`} question={question} index={startIndex + index} />
        ))}
      </ol>
    </section>
  );
}
