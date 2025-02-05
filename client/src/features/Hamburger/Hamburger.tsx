import { FC } from "react";
import { MenuIcon } from "../../shared/assets/icons/MenuIcon";

interface HamburgerProps {
	toogleMenu: () => void
}

export const Hamburger: FC<HamburgerProps> = ({ toogleMenu }) => {
	return (
		<nav 
			className='hidden max-sm:block fixed w-16 h-12 m-1 p-2'
			onClick={ toogleMenu }>
				<MenuIcon />
		</nav>
	);
}

