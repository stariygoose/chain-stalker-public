import { createContext } from "react";
import type { Theme } from "@/shared/lib/types/theme";

interface IThemeContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<IThemeContext | null>(null);
