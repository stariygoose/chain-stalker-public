import { UserMiniProfile } from "@/entities/user";
import { SidebarNavigation } from "@/features/navigation";
import { ThemeToggler } from "@/features/theme-toggler";

export const Sidebar = () => {
  return (
    <div className="sticky top-0 h-screen p-4 flex flex-col justify-between">
      <UserMiniProfile name="John Doe" username="@johndoe_228" />
      <nav className="flex-1 mt-4">
        <SidebarNavigation />
      </nav>
      <div className="flex items-senter">
        <ThemeToggler className="w-10 h-10" />
      </div>
    </div>
  );
};
