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
    <section className="rounded-[22px] border border-[#ececec] bg-white px-[16px] py-[16px] shadow-[0_12px_30px_rgba(15,23,42,0.05)] md:px-[20px] md:py-[18px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold tracking-[-0.03em] text-[#232323] md:text-[17px]">
            {getSectionLabel(sectionIndex)}
          </h3>
          <p className="mt-[4px] text-[11px] text-[#7b7b7b] md:text-[12px]">
            {section.title} . {section.instruction || "Attempt all questions"}
          </p>
        </div>
        <span className="rounded-full bg-[#f4f4f5] px-[10px] py-[4px] text-[10px] font-medium uppercase tracking-[0.08em] text-[#52525b]">
          {section.questions.length} question{section.questions.length === 1 ? "" : "s"}
        </span>
      </div>

      <ol className="mt-[14px] space-y-[10px]">
        {section.questions.map((question, index) => (
          <AssignmentQuestionItem key={`${section.title}-${index}-${question.text}`} question={question} index={startIndex + index} />
        ))}
      </ol>
    </section>
  );
}
