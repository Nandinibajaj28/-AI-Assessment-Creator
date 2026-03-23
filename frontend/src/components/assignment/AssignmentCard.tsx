"use client";

import { useRouter } from "next/navigation";
import DropdownMenu from "./DropdownMenu";

type Assignment = {
  id: string;
  title: string;
  assignedOn: string;
  dueDate: string;
};

type AssignmentCardProps = {
  assignment: Assignment;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onDelete: () => void;
  formatDate: (value: string) => string;
};

export default function AssignmentCard({
  assignment,
  isMenuOpen,
  onToggleMenu,
  onDelete,
  formatDate,
}: AssignmentCardProps) {
  const router = useRouter();

  return (
    <article className="relative min-h-[102px] rounded-[18px] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <h2 className="pr-3 text-[18px] font-semibold leading-[1.15] tracking-[-0.04em] text-[#363636]">
          {assignment.title}
        </h2>

        <div className="relative shrink-0">
          <button
            type="button"
            aria-label="Open menu"
            onClick={onToggleMenu}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#8a8a8a] transition hover:bg-[#f6f6f6]"
          >
            <EllipsisIcon className="h-4 w-4" />
          </button>

          {isMenuOpen ? (
            <DropdownMenu onView={() => router.push(`/assignment/${assignment.id}`)} onDelete={onDelete} />
          ) : null}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 text-[13px] leading-none">
        <p className="text-[#8d8d8d]">
          <span className="font-semibold text-[#242424]">Assigned on :</span> {formatDate(assignment.assignedOn)}
        </p>
        <p className="text-[#8d8d8d]">
          <span className="font-semibold text-[#242424]">Due :</span> {formatDate(assignment.dueDate)}
        </p>
      </div>
    </article>
  );
}

function EllipsisIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="4.5" r="1.1" fill="currentColor" />
      <circle cx="10" cy="10" r="1.1" fill="currentColor" />
      <circle cx="10" cy="15.5" r="1.1" fill="currentColor" />
    </svg>
  );
}
