import { useContext } from "react";
import { ThemeContext } from "@/shared/lib/contexts/ThemeContext";

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme can be used only inside ThemeProvider");
  }

  return context;
};

