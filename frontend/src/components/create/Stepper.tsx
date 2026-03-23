"use client";

import { MinusIcon, PlusIcon } from "@/components/create/icons";

type StepperProps = {
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
};

export function Stepper({ label, value, onDecrement, onIncrement }: StepperProps) {
  return (
    <div className="rounded-full bg-white px-[9px] py-[6px] shadow-[inset_0_0_0_1px_rgba(229,229,229,1)]">
      <div className="mb-[3px] text-center text-[10px] font-medium leading-none text-[#666666] lg:mb-0 lg:text-left">
        {label}
      </div>
      <div className="flex items-center justify-between gap-[8px]">
        <button
          type="button"
          onClick={onDecrement}
          className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#f7f7f7] text-[#8a8a8a]"
          aria-label={`Decrease ${label}`}
        >
          <MinusIcon />
        </button>
        <span className="min-w-[14px] text-center text-[12px] font-medium leading-none text-[#2c2c2c]">
          {value}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#f7f7f7] text-[#8a8a8a]"
          aria-label={`Increase ${label}`}
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}
