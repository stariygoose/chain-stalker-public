import { useEffect } from "react";
import { useThemeStore } from "./theme.store";

export const useInitTheme = () => {
  const { setTheme } = useThemeStore();

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;

    if (stored) {
      document.documentElement.dataset.theme = stored;
      setTheme(stored);
    } else {
      document.documentElement.dataset.theme = "dark";
      setTheme("dark");
    }
  }, []);
};
