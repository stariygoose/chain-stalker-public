import { create } from "zustand";

export type Theme = "light" | "dark";
const THEME_KEY = "theme";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;

  return {
    theme: stored || "dark",
    setTheme: (theme) => {
      localStorage.setItem(THEME_KEY, theme);
      document.documentElement.dataset.theme = theme;
      set({ theme });
    },
    toggleTheme: () => {
      set((state) => {
        const nextTheme = state.theme === "dark" ? "light" : "dark";
        localStorage.setItem(THEME_KEY, nextTheme);
        document.documentElement.dataset.theme = nextTheme;
        return { theme: nextTheme };
      });
    },
  };
});
