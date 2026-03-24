type EmptyStateProps = {
  onCreate?: () => void;
};

export default function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="flex max-w-[420px] flex-col items-center text-center">
      <Illustration />
      <h1 className="mt-4 text-[30px] font-semibold tracking-[-0.05em] text-[#303030] sm:text-[32px]">
        No assignments yet
      </h1>
      <p className="mt-2 max-w-[360px] text-[13px] leading-[1.45] text-[#8f8f8f]">
        Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-7 flex h-[42px] items-center justify-center rounded-full bg-[#1f1f1f] px-6 text-[13px] font-medium text-white shadow-[0_18px_34px_rgba(0,0,0,0.2)]"
      >
        <span className="mr-2 flex h-4 w-4 items-center justify-center">
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
            <path d="M10 4.167V15.833M4.167 10H15.833" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
        Create Your First Assignment
      </button>
    </div>
  );
}

function Illustration() {
  return (
    <svg width="232" height="184" viewBox="0 0 232 184" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-[210px] sm:w-[232px]" aria-hidden="true">
      <circle cx="118" cy="80" r="70" fill="url(#bg)" />
      <path d="M35 70C44 67 51 58 54 50C58 40 54 29 43 27C34 25 27 35 31 43C34 48 41 50 48 50C64 51 70 59 70 72" stroke="#1B1D29" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M93 23H137C141.418 23 145 26.5817 145 31V111C145 115.418 141.418 119 137 119H93C88.5817 119 85 115.418 85 111V31C85 26.5817 88.5817 23 93 23Z" fill="white" />
      <rect x="93" y="40" width="28" height="6" rx="3" fill="#102F45" />
      <rect x="93" y="58" width="40" height="5" rx="2.5" fill="#DADADA" />
      <rect x="93" y="74" width="34" height="5" rx="2.5" fill="#DADADA" />
      <rect x="93" y="90" width="37" height="5" rx="2.5" fill="#DADADA" />
      <rect x="93" y="106" width="29" height="5" rx="2.5" fill="#DADADA" />
      <rect x="160" y="22" width="41" height="22" rx="4" fill="white" />
      <circle cx="171.5" cy="33" r="4" fill="#DAD5E8" />
      <rect x="179" y="30" width="15" height="5.5" rx="2.75" fill="#D9D9D9" />
      <circle cx="138" cy="88" r="35" stroke="#C9BDE5" strokeWidth="5" />
      <path d="M126 76L150 100" stroke="#FF4F45" strokeWidth="6.5" strokeLinecap="round" />
      <path d="M150 76L126 100" stroke="#FF4F45" strokeWidth="6.5" strokeLinecap="round" />
      <path d="M161.5 111.5L184 134" stroke="#C9BDE5" strokeWidth="10" strokeLinecap="round" />
      <path d="M68 124L71 129L76 126L73 132L78 136L72 136.5L70 142L67 136.5L61 136L66 132L63 126L68 124Z" stroke="#4E86B8" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="195" cy="92" r="3.2" fill="#4E86B8" />
      <defs>
        <radialGradient id="bg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(118 80) rotate(90) scale(70)">
          <stop stopColor="#F7F4EF" />
          <stop offset="1" stopColor="#ECEAE6" />
        </radialGradient>
      </defs>
    </svg>
  );
}
