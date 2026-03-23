"use client";

import { ChangeEvent, RefObject } from "react";
import { UploadIcon } from "@/components/create/icons";

type UploadBoxProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function UploadBox({ fileInputRef, onChange }: UploadBoxProps) {
  return (
    <section>
      <div className="rounded-[18px] border border-dashed border-[#d6d6d6] bg-white px-4 py-[26px] text-center lg:rounded-[16px] lg:px-6 lg:py-[34px]">
        <div className="mx-auto flex h-[28px] w-[28px] items-center justify-center rounded-[8px] bg-white text-[#2d2d2d] shadow-[0_6px_14px_rgba(17,17,17,0.08)]">
          <UploadIcon />
        </div>
        <p className="mt-[18px] text-[14px] font-medium leading-[1.2] text-[#202020]">
          Choose a file or drag &amp; drop it here
        </p>
        <p className="mt-[6px] text-[10px] leading-none text-[#a0a0a0]">JPEG, PNG, upto 10MB</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-[14px] inline-flex h-[30px] items-center justify-center rounded-full bg-[#f7f7f7] px-[18px] text-[11px] font-medium text-[#4b4b4b]"
        >
          Browse Files
        </button>
        <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={onChange} />
      </div>
      <p className="mt-[9px] text-center text-[10px] leading-[1.35] text-[#9a9a9a]">
        Upload images of your preferred document/image
      </p>
    </section>
  );
}
