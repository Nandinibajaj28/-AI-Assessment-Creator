"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const VARIANT_CLASS_NAMES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-[#161616] text-white disabled:cursor-not-allowed disabled:opacity-70",
  secondary: "bg-white text-[#1f1f1f] shadow-[0_3px_10px_rgba(0,0,0,0.06)]",
  ghost: "bg-transparent text-[#1f1f1f]",
};

export function Button({
  type = "button",
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${VARIANT_CLASS_NAMES[variant]} ${className}`.trim()}
      {...props}
    />
  );
}
