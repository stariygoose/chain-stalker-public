import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

import { SidebarOption } from '@/widgets/sidebar/ui/SidebarOption';
import { LogoIcon } from '@/shared/assets/icons/LogoIcon';
import { ThemeToogler } from '@/features/';
import { useTheme } from '@/shared/lib/hooks/useTheme';
import { Hamburger } from '@/features/';
import { useSidebarOptions } from '@/widgets/sidebar/lib/hooks/useSidebarOptions';


export const Sidebar: FC = () => {
	const { sidebarOptions } = useSidebarOptions();
	const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
	const { theme, setTheme } = useTheme();

	const changeTheme = () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		theme === 'dark' ? setTheme('light') : setTheme('dark');
	}

	const toogleHamburger = () => {
		setIsOpenMenu(!isOpenMenu);
		if (!isOpenMenu) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	};

	const closeMenu = () => {
		setIsOpenMenu(false);
		document.body.style.overflow = 'auto';
	};

	return (
		<div className='relative'>
			{isOpenMenu && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40"
					onClick={closeMenu}
				>
				</div>
			)}
			<Hamburger toogleMenu={toogleHamburger}/>
			<aside className={`${
				isOpenMenu
					? "max-sm:left-0"
					: "max-sm:-left-full"
				} max-sm:fixed max-sm:h-[97%] max-sm:w-64 max-sm:items-start
				z-50 h-[97vh] w-[80px] fixed flex flex-col items-center justify-between
				p-4 bg-color-second rounded-2xl m-3 border-1
				transition-all duration-300 ease-in`}>
				<Link to="/" className='navlink'>
						<div>
							<LogoIcon	width={50} height={50}/>
						</div>
				</Link>
				<div onClick={closeMenu}>
					{
						sidebarOptions.map((option, index) => {
							return <SidebarOption
												key={index} 
												icon={option.icon}
												text={option.text}
												link={option.link}/>})
					}
				</div>
				<div className='cursor-pointer' onClick={changeTheme}>
					<ThemeToogler width={35} height={35}/>
				</div>
			</aside>
		</div>
	);
}