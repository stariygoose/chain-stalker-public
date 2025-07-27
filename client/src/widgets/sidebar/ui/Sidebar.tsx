import { UserMiniProfile } from "@/entities/user";
import { SidebarNavigation } from "@/features/navigation";
import { useTheme } from "@/shared/lib";
import { ThemeToggler } from "@/shared";

export const Sidebar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="sticky top-0 h-screen p-4 flex flex-col justify-between">
      <UserMiniProfile name="John Doe" username="@johndoe_228" />
      <nav className="flex-1 mt-4">
        <SidebarNavigation />
      </nav>
      <div className="flex items-senter">
        <ThemeToggler className="w-10 h-10" theme={theme} setTheme={setTheme} />
      </div>
    </div>
  );
};
