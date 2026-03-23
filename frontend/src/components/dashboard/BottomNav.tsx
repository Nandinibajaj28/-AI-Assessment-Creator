import type { ReactNode } from "react";

export function BottomNav() {
  return (
    <nav className="absolute inset-x-[8px] bottom-[6px] rounded-[17px] bg-[#1c1c1c] px-[10px] py-[9px] shadow-[0_14px_28px_rgba(0,0,0,0.2)]">
      <div className="grid grid-cols-4">
        <BottomNavItem
          label="Home"
          icon={
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <rect x="2.6" y="2.6" width="4.8" height="4.8" rx="1.2" fill="currentColor" />
              <rect x="10.6" y="2.6" width="4.8" height="4.8" rx="1.2" fill="currentColor" />
              <rect x="2.6" y="10.6" width="4.8" height="4.8" rx="1.2" fill="currentColor" />
              <rect x="10.6" y="10.6" width="4.8" height="4.8" rx="1.2" fill="currentColor" />
            </svg>
          }
        />
        <BottomNavItem
          label="Assignments"
          active
          icon={
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <rect x="3.2" y="2.8" width="11.6" height="12.4" rx="2.2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6.2 6.6H11.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M6.2 9.8H11.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M6.2 13H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
        <BottomNavItem
          label="Library"
          icon={
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M5.5 2.8H12.6V15.2H5.5C4.67157 15.2 4 14.5284 4 13.7V4.3C4 3.47157 4.67157 2.8 5.5 2.8Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M6.7 6.2H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
        <BottomNavItem
          label="AI Toolkit"
          icon={
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M8.95 2.4C9.46 5.31 11.69 7.54 14.6 8.05C11.69 8.56 9.46 10.79 8.95 13.7C8.44 10.79 6.21 8.56 3.3 8.05C6.21 7.54 8.44 5.31 8.95 2.4Z"
                fill="currentColor"
              />
              <path
                d="M13.05 3.4L13.35 4.15L14.1 4.45L13.35 4.75L13.05 5.5L12.75 4.75L12 4.45L12.75 4.15L13.05 3.4Z"
                fill="currentColor"
              />
            </svg>
          }
        />
      </div>
    </nav>
  );
}

function BottomNavItem({
  icon,
  label,
  active = false,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button type="button" className="flex flex-col items-center justify-center gap-[2px] py-[2px]">
      <span className={active ? "text-white" : "text-white/28"}>{icon}</span>
      <span className={active ? "text-[9px] font-medium text-white" : "text-[9px] text-white/28"}>
        {label}
      </span>
    </button>
  );
}
