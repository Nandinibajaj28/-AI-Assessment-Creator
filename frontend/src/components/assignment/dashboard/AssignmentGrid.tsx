import AssignmentCard from "@/components/assignment/dashboard/AssignmentCard";

type Assignment = {
  id: string;
  title: string;
  assignedOn: string;
  dueDate: string;
};

type AssignmentGridProps = {
  assignments: Assignment[];
  openMenuId: string | null;
  onToggleMenu: (id: string | null) => void;
  onDelete: (id: string) => void;
  formatDate: (value: string) => string;
  loading?: boolean;
};

export default function AssignmentGrid({
  assignments,
  openMenuId,
  onToggleMenu,
  onDelete,
  formatDate,
  loading = false,
}: AssignmentGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[102px] animate-pulse rounded-[18px] bg-white/70 shadow-[0_10px_24px_rgba(0,0,0,0.06)]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          isMenuOpen={openMenuId === assignment.id}
          onToggleMenu={() =>
            onToggleMenu(openMenuId === assignment.id ? null : assignment.id)
          }
          onDelete={() => onDelete(assignment.id)}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}
