"use client";

import { ArrowRightIcon, BackIcon } from "@/components/create/icons";

type FooterButtonsProps = {
  isSubmitting: boolean;
  onPrevious: () => void;
};

export function FooterButtons({ isSubmitting, onPrevious }: FooterButtonsProps) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 lg:mt-5">
      <button
        type="button"
        onClick={onPrevious}
        className="flex h-[38px] min-w-[96px] items-center justify-center gap-[6px] rounded-full bg-white px-4 text-[12px] font-medium text-[#1f1f1f] shadow-[0_3px_10px_rgba(0,0,0,0.06)]"
      >
        <BackIcon />
        <span>Previous</span>
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-[38px] min-w-[88px] items-center justify-center gap-[6px] rounded-full bg-[#161616] px-4 text-[12px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span>{isSubmitting ? "Generating..." : "Next"}</span>
        {!isSubmitting ? <ArrowRightIcon /> : null}
      </button>
    </div>
  );
}
