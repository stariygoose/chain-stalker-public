import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { Outlet } from "react-router-dom";

export const HomeLayout = () => {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
};
