import { AssignmentSection } from "@/types/assignment";
import { AssignmentQuestionItem } from "@/components/assignment/paper/AssignmentQuestionItem";

type SectionBlockProps = {
  section: AssignmentSection;
  startIndex: number;
  sectionIndex: number;
};

const getSectionLabel = (sectionIndex: number) =>
  `Section ${String.fromCharCode(65 + (sectionIndex % 26))}`;

export function SectionBlock({ section, startIndex, sectionIndex }: SectionBlockProps) {
  return (
    <section className="px-[4px] py-[4px]">
      <h3 className="text-center text-[18px] font-semibold tracking-[-0.03em] text-[#232323] md:text-[22px]">
        {getSectionLabel(sectionIndex)}
      </h3>

      <div className="mt-[8px] flex items-start justify-between gap-4">
        <div className="text-left">
          <p className="text-[14px] font-medium text-[#000000] md:text-[16px]">
            {section.title}
          </p>
          <p className="mt-[3px] text-[12px] italic text-[#666666] md:text-[14px]">
            {section.instruction || "Attempt all questions"}
          </p>
        </div>

        <p className="shrink-0 text-right text-[11px] uppercase tracking-[0.08em] text-[#7a7a7a] md:text-[12px]">
          {section.questions.length} question{section.questions.length === 1 ? "" : "s"}
        </p>
      </div>

      <ol className="mt-[12px] space-y-[4px]">
        {section.questions.map((question, index) => (
          <AssignmentQuestionItem
            key={`${section.title}-${index}-${question.text}`}
            question={question}
            index={startIndex + index}
          />
        ))}
      </ol>
    </section>
  );
}
