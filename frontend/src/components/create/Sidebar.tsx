import {
  AppLogo,
  PlusIcon,
  SidebarClockIcon,
  SidebarDocumentIcon,
  SidebarIconGrid,
  SidebarSettingsIcon,
  SidebarToolkitIcon,
  SidebarUsersIcon,
  UserAvatar,
} from "@/components/create/icons";

const items = [
  { label: "Home", icon: <SidebarIconGrid /> },
  { label: "My Groups", icon: <SidebarUsersIcon /> },
  { label: "Assignments", icon: <SidebarDocumentIcon /> },
  { label: "AI Teacher's Toolkit", icon: <SidebarToolkitIcon /> },
  { label: "My Library", icon: <SidebarClockIcon />, badge: "32" },
];

export function Sidebar() {
  return (
    <aside className="w-[156px] rounded-[16px] bg-white px-[12px] pb-[12px] pt-[10px] shadow-[0_28px_50px_rgba(0,0,0,0.14)]">
      <AppLogo />

      <button
        type="button"
        className="mt-[22px] flex h-[28px] w-full items-center justify-center gap-[6px] rounded-full bg-[#2b2b2b] text-[11px] font-medium text-white shadow-[0_0_0_2px_rgba(255,116,63,0.75)]"
      >
        <PlusIcon />
        <span>Create Assignment</span>
      </button>

      <nav className="mt-[24px] space-y-[7px]">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex h-[22px] w-full items-center justify-between rounded-[6px] px-[8px] text-left"
          >
            <span className="flex items-center gap-[7px] text-[#7c7c7c]">
              {item.icon}
              <span className="text-[10.5px] leading-none">{item.label}</span>
            </span>
            {item.badge ? (
              <span className="rounded-full bg-[#ff6f3f] px-[5px] py-[1px] text-[8px] font-medium text-white">
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="mt-[86px]">
        <button type="button" className="flex h-[22px] w-full items-center gap-[7px] px-[8px] text-[#7c7c7c]">
          <SidebarSettingsIcon />
          <span className="text-[10.5px] leading-none">Settings</span>
        </button>

        <div className="mt-[8px] rounded-[10px] bg-[#f4f1ec] px-[10px] py-[8px]">
          <div className="flex items-center gap-[8px]">
            <UserAvatar />
            <div className="min-w-0">
              <p className="truncate text-[10.5px] font-semibold text-[#2a2a2a]">Delhi Public School</p>
              <p className="truncate text-[9px] text-[#7d7d7d]">Bokaro Steel City</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
