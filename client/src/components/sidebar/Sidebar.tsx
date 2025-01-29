import { FC, MouseEvent } from 'react';

import './Sidebar.css';

import { Theme, Themes, useTheme } from '../theme-provider/Theme';
import { LogoIcon } from '../icons/LogoIcon';
import { SubscriptionsIcon } from '../icons/SubscriptionsIcon';
import { SidebarOption, SidebarOptionProps } from './SidebarOption';

export const Sidebar: FC = () => {
	const { theme, setTheme } = useTheme();

	const handleMouseEnter = (event: MouseEvent) => {
		const { currentTarget } = event;
		currentTarget.classList.add("glass_effect");
	};

	const handleMouseLeave = (event: React.MouseEvent) => {
    const { currentTarget } = event;
    currentTarget.classList.remove("glass_effect");
  };

	const changeTheme = (theme?: Themes) => {
		if (theme === "dark") {
			setTheme("light");
		} else {
			setTheme("dark")
		}
	}

	const sidebarOptions: SidebarOptionProps[] = [
		{ 
			icon: <SubscriptionsIcon width={30} height={30}/>,
			text: "adsf fasdf",
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave 
		},
		{ 
			icon: <SubscriptionsIcon width={30} height={30}/>,
			text: "adsf fasdf",
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave 
		},
		{ 
			icon: <SubscriptionsIcon width={30} height={30}/>,
			text: "adsf fasdf",
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave 
		},
		{ 
			icon: <SubscriptionsIcon width={30} height={30}/>,
			text: "adsf fasdf",
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave 
		},
		{ 
			icon: <SubscriptionsIcon width={30} height={30}/>,
			text: "adsf fasdf",
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave 
		}
	];

	return (
		<nav className="sidebar">
			<div className="sidebar_option">
				<LogoIcon	width={45} height={45}/>
				<h1 className="title sidebar_option__text">Chain Stalker</h1>
			</div>

			<div className="sidebar_wrapper">
				{
					sidebarOptions.map((option, index) => {
						return <SidebarOption
											key={index} 
											icon={option.icon}
											text={option.text}
											onMouseEnter={option.onMouseEnter}
											onMouseLeave={option.onMouseLeave}/>})
				}
			</div>
			
			<SidebarOption
				icon={<Theme.SimpleToggler width={35} height={35}/>}
				text={theme[0].toUpperCase() + String(theme).slice(1)}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onClick={changeTheme}/>
		</nav>
	);
}