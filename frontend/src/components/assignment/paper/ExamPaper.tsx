import { AssignmentResult } from "@/types/assignment";
import { AnswerKey } from "@/components/assignment/paper/AnswerKey";
import { SectionBlock } from "@/components/assignment/paper/SectionBlock";

type ExamPaperProps = {
  result: AssignmentResult | null;
  isLoading: boolean;
  schoolName: string;
  setSchoolName: (val: string) => void;
  subjectName: string;
  setSubjectName: (val: string) => void;
  className: string;
  setClassName: (val: string) => void;
  timeAllowed: string;
  setTimeAllowed: (val: string) => void;
  maximumMarks: number;
  answerKey: { id: string; text: string }[];
};

export function ExamPaper({
  result,
  isLoading,
  schoolName,
  setSchoolName,
  subjectName,
  setSubjectName,
  className,
  setClassName,
  timeAllowed,
  setTimeAllowed,
  maximumMarks,
  answerKey,
}: ExamPaperProps) {
  return (
    <article
      id="pdf-content"
      className="bg-white px-[18px] py-[22px] md:px-[48px] md:py-[44px]"
    >
      <header className="text-center">
        <input
          type="text"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          placeholder="School Name"
          className="w-full border-none bg-transparent text-center text-[18px] font-bold tracking-[-0.04em] text-[#1f1f1f] outline-none focus:ring-1 focus:ring-[#ff7a1b]/20 md:text-[28px]"
          aria-label="School Name"
        />
        <div className="mt-[8px] flex items-center justify-center gap-1 text-[15px] font-semibold text-[#2f2f2f] md:text-[21px]">
          <span>Subject:</span>
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Subject"
            className="border-none bg-transparent font-semibold outline-none focus:ring-1 focus:ring-[#ff7a1b]/20"
            aria-label="Subject"
          />
        </div>
        <div className="mt-[4px] flex items-center justify-center gap-1 text-[15px] font-semibold text-[#2f2f2f] md:text-[21px]">
          <span>Class:</span>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Class"
            className="border-none bg-transparent font-semibold outline-none focus:ring-1 focus:ring-[#ff7a1b]/20"
            aria-label="Class"
          />
        </div>
      </header>

      <div className="mt-[24px] flex items-center justify-between text-[13px] font-medium text-[#232323] md:mt-[34px] md:text-[16px]">
        <div className="flex items-center gap-1">
          <span>Time Allowed:</span>
          <input
            type="text"
            value={timeAllowed}
            onChange={(e) => setTimeAllowed(e.target.value)}
            className="border-none bg-transparent font-medium outline-none focus:ring-1 focus:ring-[#ff7a1b]/20"
            aria-label="Time Allowed"
          />
        </div>
        <p>Maximum Marks: {maximumMarks}</p>
      </div>

      <p className="mt-[18px] text-[13px] font-medium text-[#2f2f2f] md:mt-[26px] md:text-[15px]">
        All questions are compulsory unless stated otherwise.
      </p>

      <div className="mt-[22px] space-y-[4px] text-[13px] text-[#2d2d2d] md:mt-[24px] md:text-[15px]">
        <p>Name: _____________</p>
        <p>Roll Number: ________</p>
        <p>Class: {className} Section: ________</p>
      </div>

      {isLoading ? (
        <div className="py-[52px] md:py-[72px]">
          <div className="mx-auto max-w-[460px] rounded-[24px] border border-[#ece7df] bg-[linear-gradient(180deg,#fffaf4_0%,#ffffff_100%)] px-[24px] py-[24px] shadow-[0_18px_36px_rgba(148,101,42,0.08)]">
            <div className="flex items-center justify-between gap-[16px]">
              <h2 className="text-[16px] font-semibold tracking-[-0.03em] text-[#2f2a24] md:text-[18px]">
                Generating paper
              </h2>
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#b06a2f]">
                In Progress
              </span>
            </div>
            <div className="mt-[14px] h-[10px] overflow-hidden rounded-full bg-[#f3e2cf]">
              <div className="h-full w-[38%] rounded-full bg-[linear-gradient(90deg,#c97329_0%,#efb36d_100%)] animate-pulse" />
            </div>
          </div>
        </div>
      ) : result ? (
        <>
          <div className="mt-[30px] space-y-[20px] md:mt-[40px] md:space-y-[28px]">
            {result.sections.map((section, index) => (
              <SectionBlock
                key={`${section.title}-${index}`}
                section={section}
                startIndex={getQuestionStartIndex(result.sections, index)}
                sectionIndex={index}
              />
            ))}
          </div>

          <p className="mt-[26px] text-[13px] font-semibold text-[#303030] md:mt-[32px] md:text-[15px]">
            End of Question Paper
          </p>

          <div className="hidden md:block">
            <AnswerKey items={answerKey} />
          </div>
        </>
      ) : (
        <div className="py-[72px] text-center text-[14px] text-[#5d5d5d] md:text-[16px]">
          No structured assignment is available yet.
        </div>
      )}
    </article>
  );
}

function getQuestionStartIndex(sections: AssignmentResult["sections"], activeIndex: number) {
  return sections.slice(0, activeIndex).reduce((sum, section) => sum + section.questions.length, 0) + 1;
}
