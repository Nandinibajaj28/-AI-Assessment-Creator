"use client";

import { Button } from "@/components/ui/Button";
import { UploadIcon } from "@/components/assignment/shared/AssignmentIcons";
import { ChangeEvent, RefObject } from "react";

type UploadBoxProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  fileName?: string;
};

export function UploadBox({ fileInputRef, onChange, fileName }: UploadBoxProps) {
  return (
    <section>
      <div className="rounded-[18px] border border-dashed border-[#d6d6d6] bg-white px-4 py-[26px] text-center lg:rounded-[16px] lg:px-6 lg:py-[34px]">
        <div className="mx-auto flex h-[28px] w-[28px] items-center justify-center rounded-[8px] bg-white text-[#2d2d2d] shadow-[0_6px_14px_rgba(17,17,17,0.08)]">
          <UploadIcon />
        </div>
        <p className="mt-[18px] text-[14px] font-medium leading-[1.2] text-[#202020]">
          Choose a PDF or image file to generate grounded questions
        </p>
        <p className="mt-[6px] text-[10px] leading-none text-[#a0a0a0]">PDF, PNG, JPG, JPEG, WEBP up to 10MB</p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          className="mt-[14px] inline-flex h-[30px] items-center justify-center rounded-full bg-[#f7f7f7] px-[18px] text-[11px] font-medium text-[#4b4b4b]"
        >
          Browse Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          className="hidden"
          onChange={onChange}
        />
      </div>
      {fileName ? (
        <p className="mt-[9px] text-center text-[10px] leading-[1.35] text-[#5e5e5e]">
          Selected file: {fileName}
        </p>
      ) : null}
      <p className="mt-[9px] text-center text-[10px] leading-[1.35] text-[#9a9a9a]">
        Upload a chapter image, scanned note, or PDF to generate source-backed questions only.
      </p>
    </section>
  );
}
