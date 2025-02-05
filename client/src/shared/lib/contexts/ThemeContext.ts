import { createContext } from "react";
import { Themes } from "../../types/themes";

export const ThemeContext = createContext<{
			theme: Themes;
			setTheme: (theme: Themes) => void;
			supportedThemes: { [key: string]: string };
	} | null> (null);