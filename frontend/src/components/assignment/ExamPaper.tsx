import { AssignmentResult } from "@/types/assignment";
import { AnswerKey } from "./AnswerKey";
import { SectionBlock } from "./SectionBlock";

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
      className="rounded-[24px] bg-white px-[18px] py-[22px] shadow-[0_14px_34px_rgba(17,24,39,0.08)] md:px-[48px] md:py-[44px]"
    >
      <header className="text-center">
        <input
          type="text"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          placeholder="School Name"
          className="w-full border-none bg-transparent text-center text-[15px] font-semibold tracking-[-0.04em] text-[#2d2d2d] outline-none focus:ring-1 focus:ring-[#ff7a1b]/20 md:text-[22px]"
          aria-label="School Name"
        />
        <div className="mt-[6px] flex items-center justify-center gap-1 text-[14px] font-semibold text-[#3a3a3a] md:text-[19px]">
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
        <div className="mt-[2px] flex items-center justify-center gap-1 text-[14px] font-semibold text-[#3a3a3a] md:text-[19px]">
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

      <div className="mt-[24px] flex items-center justify-between text-[12px] font-medium text-[#232323] md:mt-[34px] md:text-[15px]">
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

      <p className="mt-[18px] text-[12px] font-medium text-[#2f2f2f] md:mt-[26px] md:text-[14px]">
        All questions are compulsory unless stated otherwise.
      </p>

      <div className="mt-[22px] space-y-[4px] text-[12px] text-[#2d2d2d] md:mt-[24px] md:text-[14px]">
        <p>Name: _____________</p>
        <p>Roll Number: ________</p>
        <p>Class: {className} Section: ________</p>
      </div>

      {isLoading ? (
        <div className="py-[72px] text-center text-[14px] text-[#5d5d5d] md:text-[16px]">
          Generating question paper...
        </div>
      ) : result ? (
        <>
          <div className="mt-[30px] space-y-[20px] md:mt-[40px] md:space-y-[28px]">
            {result.sections.map((section, index) => (
              <SectionBlock
                key={`${section.title}-${index}`}
                section={section}
                startIndex={getQuestionStartIndex(result.sections, index)}
              />
            ))}
          </div>

          <p className="mt-[26px] text-[12px] font-semibold text-[#303030] md:mt-[32px] md:text-[14px]">
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
