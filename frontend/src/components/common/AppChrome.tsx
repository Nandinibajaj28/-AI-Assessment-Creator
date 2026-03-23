"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/common/Sidebar";

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showSidebar =
    pathname === "/" ||
    pathname.startsWith("/assignments") ||
    pathname.startsWith("/create");

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen bg-[#efefef] p-[8px] md:p-[10px]">
      <div className="mx-auto flex max-w-[1380px] gap-[10px] md:min-h-[calc(100vh-20px)]">
        <aside className="hidden md:block md:shrink-0">
          <div className="sticky top-[10px]">
            <Sidebar />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}

