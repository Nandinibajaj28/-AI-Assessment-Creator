type FloatingButtonProps = {
  label: string;
  onClick?: () => void;
};

export default function FloatingButton({ label, onClick }: FloatingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-20 left-1/2 z-20 flex h-[42px] -translate-x-1/2 items-center justify-center rounded-full bg-[#1f1f1f] px-6 text-[13px] font-medium text-white shadow-[0_18px_34px_rgba(0,0,0,0.24)] sm:bottom-6"
    >
      <span className="mr-2 flex h-4 w-4 items-center justify-center">
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
          <path d="M10 4.167V15.833M4.167 10H15.833" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      {label.startsWith("+") ? label : `+ ${label}`}
    </button>
  );
}
