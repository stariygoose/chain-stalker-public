import { THEME_KEY, ThemeContext, type Theme } from "@/shared/lib";
import { useLayoutEffect, useState, type FC, type ReactNode } from "react";

const getTheme = (): Theme => {
  const theme = localStorage.getItem(THEME_KEY) as Theme;
  if (theme === "dark" || theme === "light") return theme;

  const preferedTheme = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  return preferedTheme ? "dark" : "light";
};

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setStateTheme] = useState<Theme>(getTheme);

  const setTheme = (t: Theme) => {
    setStateTheme(t);
    localStorage.setItem(THEME_KEY, t);
  };

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
