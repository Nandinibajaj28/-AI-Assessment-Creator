import type { ReactNode } from "react";

export function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 3.5L5.5 8L10 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4.75C9.65279 4.75 7.75 6.65279 7.75 9V11.0653C7.75 11.7527 7.51142 12.4189 7.075 12.95L6 14.25H18L16.925 12.95C16.4886 12.4189 16.25 11.7527 16.25 11.0653V9C16.25 6.65279 14.3472 4.75 12 4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10.25 17C10.5948 17.6117 11.2507 18 12 18C12.7493 18 13.4052 17.6117 13.75 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M4 4L10 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10 4L4 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="14.5" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 9.5H20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function MinusIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 5H8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M5 2V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M2 5H8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="17" height="17" rx="4.5" fill="white" />
      <path d="M10 12V6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7.5 8.75L10 6.25L12.5 8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.75 13.75H13.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="1.5" y="1.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 7H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M7.75 3.75L11 7L7.75 10.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AppLogo() {
  return (
    <div className="flex items-center gap-[8px]">
      <div className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px] bg-[linear-gradient(180deg,#f3b66d_0%,#cc6b34_48%,#7c2a1d_100%)]">
        <span className="text-[15px] font-black leading-none tracking-[-0.08em] text-white">V</span>
      </div>
      <span className="text-[15px] font-semibold tracking-[-0.03em] text-[#242424]">VedaAI</span>
    </div>
  );
}

export function UserAvatar({ size = "md" }: { size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "h-6 w-6 text-[12px]" : "h-7 w-7 text-[13px]";

  return (
    <div className={`flex ${sizeClass} items-center justify-center rounded-full bg-[#f2d8be]`}>
      <span>🧑🏽‍🏫</span>
    </div>
  );
}

export function MobileMenuIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4 12H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4 17H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function SidebarIconGrid() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2H5.5V5.5H2V2Z" stroke="currentColor" strokeWidth="1.15" />
      <path d="M8.5 2H12V5.5H8.5V2Z" stroke="currentColor" strokeWidth="1.15" />
      <path d="M2 8.5H5.5V12H2V8.5Z" stroke="currentColor" strokeWidth="1.15" />
      <path d="M8.5 8.5H12V12H8.5V8.5Z" stroke="currentColor" strokeWidth="1.15" />
    </svg>
  );
}

export function SidebarUsersIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M4.5 6.1C5.49411 6.1 6.3 5.29411 6.3 4.3C6.3 3.30589 5.49411 2.5 4.5 2.5C3.50589 2.5 2.7 3.30589 2.7 4.3C2.7 5.29411 3.50589 6.1 4.5 6.1Z" stroke="currentColor" strokeWidth="1.15" />
      <path d="M9.8 5.4C10.5732 5.4 11.2 4.7732 11.2 4C11.2 3.2268 10.5732 2.6 9.8 2.6C9.0268 2.6 8.4 3.2268 8.4 4C8.4 4.7732 9.0268 5.4 9.8 5.4Z" stroke="currentColor" strokeWidth="1.15" />
      <path d="M2.2 11.1C2.89309 9.82457 4.00127 9.2 5.52452 9.2C7.04778 9.2 8.15596 9.82457 8.84905 11.1" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      <path d="M8.95 10.6C9.36404 9.78095 10.1224 9.35 11.225 9.35C11.6019 9.35 11.9321 9.39951 12.2155 9.49853" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  );
}

export function SidebarDocumentIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M4 1.75H9.9L11.75 3.65V12.25H4V1.75Z" stroke="currentColor" strokeWidth="1.15" />
      <path d="M9.75 1.85V3.85H11.65" stroke="currentColor" strokeWidth="1.15" />
      <path d="M5.7 6.1H9.9" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      <path d="M5.7 8.4H9.9" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  );
}

export function SidebarToolkitIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="3.2" y="1.8" width="7.6" height="10.4" stroke="currentColor" strokeWidth="1.15" />
      <path d="M4.8 4.4H9.2" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      <path d="M4.8 6.7H9.2" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  );
}

export function SidebarClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.7" stroke="currentColor" strokeWidth="1.15" />
      <path d="M7 4.5V7L8.9 8.15" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  );
}

export function SidebarSettingsIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="1.6" stroke="currentColor" strokeWidth="1.15" />
      <path d="M11 7C11 6.75547 10.9729 6.51726 10.9214 6.2881L11.9 5.56667L11.0333 4.06667L9.86667 4.5C9.50302 4.21389 9.08177 3.99655 8.62262 3.8625L8.43333 2.6H5.56667L5.37738 3.8625C4.91823 3.99655 4.49698 4.21389 4.13333 4.5L2.96667 4.06667L2.1 5.56667L3.07857 6.2881C3.02714 6.51726 3 6.75547 3 7C3 7.24453 3.02714 7.48274 3.07857 7.7119L2.1 8.43333L2.96667 9.93333L4.13333 9.5C4.49698 9.78611 4.91823 10.0035 5.37738 10.1375L5.56667 11.4H8.43333L8.62262 10.1375C9.08177 10.0035 9.50302 9.78611 9.86667 9.5L11.0333 9.93333L11.9 8.43333L10.9214 7.7119C10.9729 7.48274 11 7.24453 11 7Z" stroke="currentColor" strokeWidth="1.05" strokeLinejoin="round" />
    </svg>
  );
}

export function BottomNavItemIcon({
  children,
  active = false,
  label,
}: {
  children: ReactNode;
  active?: boolean;
  label: string;
}) {
  return (
    <button type="button" className="flex flex-col items-center justify-center gap-[2px]">
      <span className={active ? "text-white" : "text-white/32"}>{children}</span>
      <span className={active ? "text-[9px] font-medium text-white" : "text-[9px] text-white/32"}>{label}</span>
    </button>
  );
}
