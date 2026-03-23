export function DashboardHeader() {
  return (
    <header className="px-[8px] pt-[8px]">
      <div className="flex items-center justify-between rounded-[14px] bg-[#faf9f7] px-[10px] py-[8px] shadow-[0_1px_0_rgba(255,255,255,0.9),0_8px_18px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-[7px]">
          <div className="flex h-[22px] w-[22px] items-center justify-center rounded-[7px] bg-[#3c3c3c]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M2.15 3.3C2.15 2.58203 2.73203 2 3.45 2H10.55C11.268 2 11.85 2.58203 11.85 3.3V10.7C11.85 11.418 11.268 12 10.55 12H3.45C2.73203 12 2.15 11.418 2.15 10.7V3.3Z"
                fill="white"
              />
              <path
                d="M4.1 4.35L6.95 8.05L9.9 4.35"
                stroke="#3c3c3c"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.04em] text-[#383838]">
            VedaAI
          </span>
        </div>

        <div className="flex items-center gap-[10px] text-[#444444]">
          <button
            type="button"
            className="relative flex h-[26px] w-[26px] items-center justify-center"
            aria-label="Notifications"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M10 3.4C8.04039 3.4 6.4525 4.98789 6.4525 6.9475V8.66272C6.4525 9.37611 6.1831 10.0631 5.69898 10.5872L4.95 11.398V12.125H15.05V11.398L14.301 10.5872C13.8169 10.0631 13.5475 9.37611 13.5475 8.66272V6.9475C13.5475 4.98789 11.9596 3.4 10 3.4Z"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinejoin="round"
              />
              <path
                d="M8.35 14.05C8.55924 14.5839 9.07626 14.95 9.66 14.95H10.34C10.9237 14.95 11.4408 14.5839 11.65 14.05"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute right-[2px] top-[1px] h-[6px] w-[6px] rounded-full bg-[#ff5b2e]" />
          </button>

          <div className="flex h-[24px] w-[24px] items-center justify-center overflow-hidden rounded-full bg-[#2e2c2b]">
            <span className="text-[12px]">🧑🏽</span>
          </div>

          <button
            type="button"
            className="flex h-[26px] w-[26px] items-center justify-center"
            aria-label="Menu"
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M4.1 5.25H13.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M4.1 9H13.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M4.1 12.75H13.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
