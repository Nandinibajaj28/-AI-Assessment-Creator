"use client";

import { useState } from "react";

type Html2PdfInstance = {
  set: (options: object) => Html2PdfInstance;
  from: (element: HTMLElement) => Html2PdfInstance;
  save: () => Promise<void>;
};

type Html2PdfModule = () => Html2PdfInstance;

export function PDFButton() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById("pdf-content");
    if (!element || isDownloading) return;

    try {
      setIsDownloading(true);
      // @ts-expect-error html2pdf.js does not ship first-party TypeScript types.
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = (html2pdfModule.default ?? html2pdfModule) as Html2PdfModule;

      await html2pdf()
        .set({
          margin: 10,
          filename: "assignment.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDownloading}
      className="inline-flex h-[36px] items-center gap-[8px] rounded-full bg-white px-[14px] text-[12px] font-medium text-[#2b2b2b] shadow-[0_10px_18px_rgba(0,0,0,0.12)] transition hover:bg-[#f4f4f4] disabled:cursor-not-allowed disabled:opacity-70 md:h-[38px] md:px-[15px] md:text-[13px]"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M8 2.75V9.25"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.75 7.5L8 9.75L10.25 7.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 11.5H13"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{isDownloading ? "Preparing PDF..." : "Download as PDF"}</span>
    </button>
  );
}
