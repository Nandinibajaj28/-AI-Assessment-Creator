"use client";

import { ChevronDownIcon, CloseIcon } from "@/components/assignment/shared/AssignmentIcons";
import { StepperControl } from "@/components/assignment/create/StepperControl";

type QuestionItemValue = {
  id: string;
  type: string;
  count: number;
  marks: number;
};

type QuestionItemProps = {
  value: QuestionItemValue;
  canRemove: boolean;
  options: { label: string; value: string }[];
  onTypeChange: (id: string, type: string) => void;
  onStep: (id: string, key: "count" | "marks", delta: number) => void;
  onRemove: (id: string) => void;
};

export function QuestionItem({
  value,
  canRemove,
  options,
  onTypeChange,
  onStep,
  onRemove,
}: QuestionItemProps) {
  return (
    <div className="rounded-[16px] bg-white px-[10px] py-[10px] lg:grid lg:grid-cols-[1.3fr_0.9fr] lg:items-center lg:gap-[12px] lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0">
      <div className="flex items-center gap-[8px]">
        <div className="relative flex-1">
          <select
            value={value.type}
            onChange={(event) => onTypeChange(value.id, event.target.value)}
            className="h-[30px] w-full appearance-none rounded-full border border-[#ececec] bg-white pl-[12px] pr-[26px] text-[10.5px] leading-none text-[#252525] outline-none"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-[10px] flex items-center text-[#7a7a7a]">
            <ChevronDownIcon />
          </span>
        </div>

        <button
          type="button"
          onClick={() => onRemove(value.id)}
          disabled={!canRemove}
          className="flex h-[18px] w-[18px] items-center justify-center text-[#7b7b7b] disabled:opacity-40"
          aria-label="Remove question type"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="mt-[8px] grid grid-cols-2 gap-[8px] lg:mt-0">
        <StepperControl
          label="No. of Questions"
          value={value.count}
          onDecrement={() => onStep(value.id, "count", -1)}
          onIncrement={() => onStep(value.id, "count", 1)}
        />
        <StepperControl
          label="Marks"
          value={value.marks}
          onDecrement={() => onStep(value.id, "marks", -1)}
          onIncrement={() => onStep(value.id, "marks", 1)}
        />
      </div>
    </div>
  );
}
