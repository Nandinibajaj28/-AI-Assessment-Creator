type DropdownMenuProps = {
  onView?: () => void;
  onDelete: () => void;
};

export default function DropdownMenu({ onView, onDelete }: DropdownMenuProps) {
  return (
    <div className="absolute right-4 top-8 z-20 w-[118px] rounded-[14px] bg-white px-3 py-2 shadow-[0_14px_28px_rgba(0,0,0,0.12)] ring-1 ring-black/5">
      <button
        type="button"
        onClick={onView}
        className="block w-full rounded-md px-1 py-1.5 text-left text-[11px] font-medium text-[#313131] transition hover:bg-[#f8f8f8]"
      >
        View Assignment
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="mt-1 block w-full rounded-md px-1 py-1.5 text-left text-[11px] font-medium text-[#ff5c43] transition hover:bg-[#fff4f1]"
      >
        Delete
      </button>
    </div>
  );
}
