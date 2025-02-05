import { FC, MouseEvent, ReactNode } from "react";

import style from "./Sidebar.module.css"
import { NavLink } from "react-router-dom";

export interface SidebarOptionProps {
	icon: ReactNode,
	text: string,
	onMouseEnter?: (event: MouseEvent) => void,
	onMouseLeave?: (event: MouseEvent) => void,
	onClick?: (event: MouseEvent) => void,
}

export const SidebarOption: FC<SidebarOptionProps> = ({
	icon,
	text,
	onMouseEnter,
	onMouseLeave,
	onClick
}) => {
	return (
		<NavLink to='/test' className={({isActive}) => (isActive ? "navlink active" : 'navlink')}>
			<div className={`${style.sidebar_option}`}
					onMouseEnter={onMouseEnter}
					onMouseLeave={onMouseLeave}
					onClick={onClick}>
				<span className={style.sidebar_option__logo}> { icon } </span> 
				<span className={`${style.sidebar_option__text} text-normal`}> { text } </span>
			</div>
		</NavLink>
	);
}