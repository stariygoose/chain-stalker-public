import { createContext, useContext, useEffect, useState } from "react";
import { ThemeIcon } from "../ icons/ThemeIcon";
import "./themes.css"

const StorageKey = 'features-color-theme';

const supportedThemes = {
	light: 'light',
	dark: 'dark',
};
export type Themes = keyof typeof supportedThemes;
  
const ThemeContext = createContext<
	| {
      theme: Themes;
      setTheme: (theme: Themes) => void;
      supportedThemes: { [key: string]: string };
		}
	| undefined
>(undefined);

const getTheme = (): Themes => {
  let theme = localStorage.getItem(StorageKey);

  if (!theme) {
    localStorage.setItem(StorageKey, 'dark');
    theme = 'dark';
  }

  return theme as Themes;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'You can use "useTheme" hook only within a <ThemeProvider> component.'
    );
  }

  return context;
};

export const Theme = (props: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Themes>(getTheme);

  useEffect(() => {
    localStorage.setItem(StorageKey, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        supportedThemes,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};


Theme.SimpleToggler = function SimpleToggler({ width, height }: {width: number, height: number}) {
  const { theme, setTheme } = useTheme();

  const handleSwitchTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <div onClick={handleSwitchTheme}>
      <ThemeIcon width={width} height={height}/>
    </div>
  );
};
