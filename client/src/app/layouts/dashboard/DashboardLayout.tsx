import type { FC } from "react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "@/widgets/sidebar";
import Bg from "@/app/layouts/assets/bg_main.svg?react";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

export const DashboardLayout: FC = () => {
  return (
    <ThemeProvider>
      <Bg className="absolute bg-primary w-screen h-screen z-[-10] left-0 top-0" />
      <Sidebar />
      <main className="flex justify-end relative h-screen mr-4 ">
        <Outlet />
      </main>
    </ThemeProvider>
  );
};
