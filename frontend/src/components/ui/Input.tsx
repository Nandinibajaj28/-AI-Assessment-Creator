"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = "", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={`h-[32px] w-full rounded-full border border-[#e8e8e8] bg-[#f8f8f8] px-[12px] text-[11px] text-[#3a3a3a] outline-none placeholder:text-[#c0c0c0] ${className}`.trim()}
      {...props}
    />
  );
});
