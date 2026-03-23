type SummaryProps = {
  totalQuestions: number;
  totalMarks: number;
};

export function Summary({ totalQuestions, totalMarks }: SummaryProps) {
  return (
    <div className="text-right text-[13px] leading-[1.55] text-[#2d2d2d]">
      <p>Total Questions : {totalQuestions}</p>
      <p>Total Marks : {totalMarks}</p>
    </div>
  );
}
