import { FC } from "react";
import { IconProps } from "@/shared/types/icons";

export const MenuIcon: FC<IconProps> = ({className = ''}) => {
	return (
		<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
			<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
			<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
			<g id="SVGRepo_iconCarrier">
				<path className={`${className} fill-[var(--fill-color)]`} fillRule="evenodd" d="M18 5a1 1 0 100-2H2a1 1 0 000 2h16zm0 4a1 1 0 100-2H2a1 1 0 100 2h16zm1 3a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 5a1 1 0 100-2H2a1 1 0 100 2h16z"></path> 
			</g>
		</svg>
	);
}