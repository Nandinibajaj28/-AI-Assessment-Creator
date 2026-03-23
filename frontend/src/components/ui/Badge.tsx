import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-[9px] py-[2px] text-[10px] font-medium ${className}`.trim()}
      {...props}
    />
  );
}
