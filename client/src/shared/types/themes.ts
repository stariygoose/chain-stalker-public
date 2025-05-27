export const supportedThemes = {
	light: 'light',
	dark: 'dark'
} as const;

export type Themes = typeof supportedThemes[keyof typeof supportedThemes];
export const StorageKey = 'color-theme';