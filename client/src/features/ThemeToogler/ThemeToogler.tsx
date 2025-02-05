import { FC } from "react"
import { IconProps } from "../../shared/types/icons"
import { useTheme } from "../../shared/lib/hooks/useTheme"
import { ThemeIcon } from "../../shared/assets/icons/ThemeIcon";

export const ThemeToogler: FC<IconProps>= ({ width, height, color, className }) => {
	const { theme, setTheme } = useTheme();
	const toogleTheme = () => {
		return theme === 'dark'
		? setTheme('light')
		: setTheme('dark');
	}

	return (
		<div onClick={toogleTheme}>
			<ThemeIcon
				width={width}
				height={height}
				color={color}
				className={className}/>
		</div>
	);
}