import { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";

export interface SidebarOptionProps {
	icon: ReactNode,
	text: string,
	link: string,
}

export const SidebarOption: FC<SidebarOptionProps> = ({
	icon,
	text,
	link
}) => {
	const parrentOptionStyles = 'relative flex items-center justify-center' +
						' h-12 w-16 mt-2 mb-2 mx-auto rounded-3xl' +
						' hover:bg-color-hover hover:rounded' +
						' transition-all duration-200 ease-linear' +
						' group';
	
	const childOptionStyles = 'absolute w-auto p-2 m-6 min-w-max left-14' + 
						' rounded-md shadow-md bg-color-hover font-bold capitalize' +
						' transition-all duration-200 scale-0' +
						' group-hover:scale-100' +
						' max-sm:scale-100';

	return (
		<NavLink to={ link }
			className={
				({isActive}) => isActive 
				? parrentOptionStyles + ' bg-color-hover inset-shadow-md outline-2 outline-offset-2'
				: parrentOptionStyles
		}>
			{ icon }
			<span className={childOptionStyles}>
				{text}
			</span>
		</NavLink>
	);
}