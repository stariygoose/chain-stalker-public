import { FC, MouseEvent, ReactNode } from "react";
import { Themes, useTheme } from "../theme-provider/Theme";

export interface SidebarOptionProps {
	icon: ReactNode,
	text: string,
	onMouseEnter?: (event: MouseEvent) => void,
	onMouseLeave?: (event: MouseEvent) => void,
	onClick?: (theme?: Themes) => void
}

export const SidebarOption: FC<SidebarOptionProps> = ({
	icon,
	text,
	onMouseEnter,
	onMouseLeave,
	onClick
}) => {
	const { theme } = useTheme();

	return (
		<div className="sidebar_option"
					onMouseEnter={onMouseEnter}
					onMouseLeave={onMouseLeave}
					onClick={() => onClick?.(theme)}
		>
			{ icon }
			<p className="text">{text}</p>
		</div>
	);
}