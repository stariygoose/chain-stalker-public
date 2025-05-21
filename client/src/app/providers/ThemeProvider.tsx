import { useEffect, useState } from "react";
import { StorageKey, supportedThemes, Themes } from "@/shared/types/themes";
import { ThemeContext } from "@/shared/lib/contexts/ThemeContext";


const getTheme = (): Themes => {
	let theme = localStorage.getItem(StorageKey);

	if (!theme) {
		localStorage.setItem(StorageKey, 'dark');
		theme = 'dark';
	}

	return theme as Themes;
};

export const ThemeProvider = (props: { children: React.ReactNode }) => {
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