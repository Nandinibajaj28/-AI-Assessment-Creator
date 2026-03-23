"use client";

import { Button } from "@/components/ui/Button";
import { ArrowRightIcon, BackIcon } from "@/components/assignment/shared/AssignmentIcons";

type CreateFormFooterProps = {
  isSubmitting: boolean;
  onPrevious: () => void;
};

export function CreateFormFooter({ isSubmitting, onPrevious }: CreateFormFooterProps) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 lg:mt-5">
      <Button
        type="button"
        variant="secondary"
        onClick={onPrevious}
        className="flex h-[38px] min-w-[96px] items-center justify-center gap-[6px] rounded-full px-4 text-[12px] font-medium"
      >
        <BackIcon />
        <span>Previous</span>
      </Button>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex h-[38px] min-w-[88px] items-center justify-center gap-[6px] rounded-full px-4 text-[12px] font-medium"
      >
        <span>{isSubmitting ? "Generating..." : "Next"}</span>
        {!isSubmitting ? <ArrowRightIcon /> : null}
      </Button>
    </div>
  );
}
