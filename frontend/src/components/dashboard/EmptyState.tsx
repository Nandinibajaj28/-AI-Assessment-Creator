import Link from "next/link";

export function EmptyState({ mobile = false }: { mobile?: boolean }) {
  return (
    <section className="flex w-full flex-col items-center text-center">
      <DashboardIllustration mobile={mobile} />

      <h2
        className={
          mobile
            ? "mt-[26px] text-[18px] font-bold tracking-[-0.03em] text-[#303030]"
            : "mt-[22px] text-[17px] font-semibold tracking-[-0.03em] text-[#333333]"
        }
      >
        No assignments yet
      </h2>

      <p
        className={
          mobile
            ? "mt-[14px] max-w-[306px] text-[12px] leading-[1.45] text-[#7a7a7a]"
            : "mt-[8px] max-w-[394px] text-[13px] leading-[1.38] text-[#8d8a86]"
        }
      >
        Create your first assignment to start collecting and grading student submissions. You
        can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>

      <Link href="/create">
        <button
          type="button"
          className={
            mobile
              ? "mt-[20px] inline-flex h-[40px] items-center justify-center gap-[8px] rounded-full bg-[#1f1f1f] px-[18px] text-[12px] font-medium text-white shadow-[0_12px_22px_rgba(0,0,0,0.14)]"
              : "mt-[24px] inline-flex h-[33px] items-center justify-center gap-[8px] rounded-full bg-[#1f1f1f] px-[19px] text-[12px] font-medium text-white shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
          }
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 2.2V11.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M2.2 7H11.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Create Your First Assignment</span>
        </button>
      </Link>
    </section>
  );
}

function DashboardIllustration({ mobile }: { mobile?: boolean }) {
  return (
    <div className={mobile ? "relative h-[170px] w-[190px]" : "relative h-[220px] w-[220px]"}>
      <div
        className={
          mobile
            ? "absolute left-1/2 top-[20px] h-[118px] w-[118px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.55)_70%,rgba(255,255,255,0)_100%)]"
            : "absolute left-1/2 top-[16px] h-[178px] w-[178px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.35)_68%,rgba(255,255,255,0)_100%)]"
        }
      />

      <div className={mobile ? "absolute left-[14px] top-[54px] text-[#142333]" : "absolute left-[35px] top-[73px] text-[#142333]"}>
        <svg width={mobile ? "51" : "60"} height={mobile ? "46" : "56"} viewBox="0 0 60 56" fill="none" aria-hidden="true">
          <path
            d="M46 7C43.6472 18.6706 36.7788 29.1679 26.7463 34.8178C21.9163 37.5382 16.7082 39.0606 11.4443 39.3112"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M26.7 34.8C23.307 30.4334 17.8087 27.2298 11.5742 26.823"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {!mobile ? (
        <>
          <div className="absolute left-[41px] top-[116px] rotate-[-12deg] text-[#34c98c]">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
              <path d="M5 5L27.5 14L15.3 18.3L11 30L5 5Z" fill="currentColor" />
              <path d="M15 18L27.5 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute left-[58px] top-[140px] h-[3px] w-[14px] rounded-full bg-[#39d48f]" />
        </>
      ) : null}

      <div
        className={
          mobile
            ? "absolute left-[68px] top-[35px] rounded-[16px] bg-white px-[17px] py-[18px] shadow-[0_10px_20px_rgba(15,23,42,0.05)]"
            : "absolute left-[80px] top-[48px] rounded-[18px] bg-white px-[20px] py-[21px] shadow-[0_14px_28px_rgba(15,23,42,0.05)]"
        }
      >
        <div className={mobile ? "mb-[11px] h-[6px] w-[31px] rounded-full bg-[#132536]" : "mb-[12px] h-[8px] w-[38px] rounded-full bg-[#132536]"} />
        <div className={mobile ? "space-y-[9px]" : "space-y-[11px]"}>
          <div className={mobile ? "h-[6px] w-[46px] rounded-full bg-[#d6d6d6]" : "h-[7px] w-[58px] rounded-full bg-[#d6d6d6]"} />
          <div className={mobile ? "h-[6px] w-[58px] rounded-full bg-[#dedede]" : "h-[7px] w-[80px] rounded-full bg-[#dedede]"} />
          <div className={mobile ? "h-[6px] w-[46px] rounded-full bg-[#d9d9d9]" : "h-[7px] w-[63px] rounded-full bg-[#d9d9d9]"} />
          <div className={mobile ? "h-[6px] w-[52px] rounded-full bg-[#e1e1e1]" : "h-[7px] w-[72px] rounded-full bg-[#e1e1e1]"} />
        </div>
      </div>

      <div className={mobile ? "absolute left-[31px] top-[125px] text-[#53a1d5]" : "absolute left-[56px] top-[171px] text-[#4d8ec5]"}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 1.5C8.53 4.53 10.97 6.97 14 7.5C10.97 8.03 8.53 10.47 8 13.5C7.47 10.47 5.03 8.03 2 7.5C5.03 6.97 7.47 4.53 8 1.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div
        className={
          mobile
            ? "absolute left-[98px] top-[36px] rounded-[6px] bg-white px-[7px] py-[6px] shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
            : "absolute left-[138px] top-[58px] rounded-[7px] bg-white px-[10px] py-[8px] shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
        }
      >
        <div className="flex items-center gap-[5px]">
          <div className={mobile ? "h-[8px] w-[8px] rounded-full bg-[#d5cfe0]" : "h-[9px] w-[9px] rounded-full bg-[#d5cfe0]"} />
          <div className={mobile ? "h-[7px] w-[17px] rounded-full bg-[#d4d4d4]" : "h-[8px] w-[18px] rounded-full bg-[#d4d4d4]"} />
        </div>
      </div>

      <div
        className={
          mobile
            ? "absolute left-[96px] top-[64px] z-10 flex h-[74px] w-[74px] items-center justify-center rounded-full border-[6px] border-[#cfc6df] bg-[rgba(250,245,255,0.82)]"
            : "absolute left-[126px] top-[94px] z-10 flex h-[88px] w-[88px] items-center justify-center rounded-full border-[6px] border-[#c4bddb] bg-[rgba(249,244,255,0.8)]"
        }
      >
        <div className={mobile ? "absolute h-[7px] w-[36px] rotate-45 rounded-full bg-[#ff544b]" : "absolute h-[8px] w-[44px] rotate-45 rounded-full bg-[#ff544b]"} />
        <div className={mobile ? "absolute h-[7px] w-[36px] -rotate-45 rounded-full bg-[#ff544b]" : "absolute h-[8px] w-[44px] -rotate-45 rounded-full bg-[#ff544b]"} />
      </div>

      <div className={mobile ? "absolute left-[155px] top-[117px] h-[34px] w-[12px] rotate-[-42deg] rounded-full bg-[#ddd5ea]" : "absolute left-[196px] top-[163px] h-[37px] w-[14px] rotate-[-44deg] rounded-full bg-[#d2cae3]"} />
      <div className={mobile ? "absolute left-[164px] top-[90px] h-[6px] w-[6px] rounded-full bg-[#4d91c7]" : "absolute left-[212px] top-[155px] h-[9px] w-[9px] rounded-full bg-[#4788be]"} />
    </div>
  );
}
