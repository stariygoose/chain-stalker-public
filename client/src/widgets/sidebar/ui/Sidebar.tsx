import { useTheme } from "@/shared/lib";
import { ThemeToggler } from "@/shared/ui";

export const Sidebar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <aside className="w-50 h-screen py-5 glass-bg-effect fixed top-0 left-0 flex flex-col items-center justify-between z-100 border-r-1 border-brand rounded-l-none gap-10">
      <h1 className=" text-2xl font-bold">User Nick</h1>
      <div className="flex-1">
        <ul className="flex justify-between flex-col gap-2 cursor-pointer">
          <li className="text-lg">Dashboard</li>
          <li className="text-lg">Subscriptions</li>
        </ul>
      </div>
      <div className="flex justify-between items-senter">
        <ThemeToggler className="w-10 h-10" theme={theme} setTheme={setTheme} />
      </div>
    </aside>
  );
};
