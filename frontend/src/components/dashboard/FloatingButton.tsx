import Link from "next/link";

export function FloatingButton() {
  return (
      <Link href="/create">
        <button
          type="button"
          aria-label="Create assignment"
          className="absolute bottom-[74px] right-[8px] flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-[#ff7a1b] shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
        >
          <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M9 3V15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M3 9H15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </Link>
  );
}
