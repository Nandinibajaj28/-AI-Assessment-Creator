"use client";

import { useRouter } from "next/navigation";
import { AppLogo, BackIcon, BellIcon, MobileMenuIcon, UserAvatar } from "@/components/assignment/shared/AssignmentIcons";

export function CreateFormHeader() {
  const router = useRouter();

  return (
    <>
      <header className="hidden items-center justify-between rounded-[18px] bg-white px-[20px] py-[11px] shadow-[0_10px_28px_rgba(0,0,0,0.05)] lg:flex">
        <div className="flex items-center gap-[14px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#f6f6f6] text-[#464646]"
            aria-label="Go back"
          >
            <BackIcon />
          </button>
          <span className="text-[12px] font-medium text-[#b1b1b1]">Assignment</span>
        </div>

        <div className="flex items-center gap-[12px]">
          <button type="button" className="text-[#2b2b2b]" aria-label="Notifications">
            <BellIcon />
          </button>
          <div className="flex items-center gap-[8px]">
            <UserAvatar />
            <span className="text-[12px] font-medium text-[#2a2a2a]">John Doe</span>
          </div>
        </div>
      </header>

      <header className="lg:hidden">
        <div className="flex items-center justify-between rounded-[14px] bg-white px-[10px] py-[9px] shadow-[0_10px_24px_rgba(0,0,0,0.05)]">
          <AppLogo />
          <div className="flex items-center gap-[10px]">
            <button type="button" className="relative text-[#1f1f1f]" aria-label="Notifications">
              <BellIcon />
              <span className="absolute -right-[1px] top-0 h-[5px] w-[5px] rounded-full bg-[#ff6a3d]" />
            </button>
            <UserAvatar size="sm" />
            <button type="button" className="text-[#4a4a4a]" aria-label="Open menu">
              <MobileMenuIcon />
            </button>
          </div>
        </div>

        <div className="relative mt-[10px] flex items-center justify-center px-[4px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-0 flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#efefef] text-[#4a4a4a]"
            aria-label="Go back"
          >
            <BackIcon />
          </button>
          <h1 className="text-[13px] font-semibold text-[#212121]">Create Assignment</h1>
        </div>
      </header>
    </>
  );
}
