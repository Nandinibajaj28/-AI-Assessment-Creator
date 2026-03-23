type AnswerKeyItem = {
  id: string;
  text: string;
};

type AnswerKeyProps = {
  items: AnswerKeyItem[];
};

export function AnswerKey({ items }: AnswerKeyProps) {
  return (
    <section className="mt-[28px]">
      <h3 className="text-[22px] font-semibold tracking-[-0.03em] text-[#272727]">Answer Key:</h3>

      <ol className="mt-[14px] space-y-[10px] pl-[18px] text-[13px] leading-[1.75] text-[#3d3d3d] marker:font-medium marker:text-[#2f2f2f] md:text-[14px]">
        {items.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ol>
    </section>
  );
}
