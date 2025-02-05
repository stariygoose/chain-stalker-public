import { FC } from 'react';

import style from "./Sidebar.module.css"
import { SidebarOption, SidebarOptionProps } from './SidebarOption';
import { SubscriptionsIcon } from '../../shared/assets/icons/SubscriptionsIcon';
import { LogoIcon } from '../../shared/assets/icons/LogoIcon';
import { ThemeToogler } from '../../features/ThemeToogler/ThemeToogler';
import { useTheme } from '../../shared/lib/hooks/useTheme';
import { Link, NavLink } from 'react-router-dom';
import { Arrow } from '../../shared/assets/icons/Arrow';


const sidebarOptions: SidebarOptionProps[] = [
	{ 
		icon: <SubscriptionsIcon width={30} height={30}/>,
		text: "adsf fasdf",
	},
	{ 
		icon: <SubscriptionsIcon width={30} height={30}/>,
		text: "adsf fasdf",
	},
	{ 
		icon: <SubscriptionsIcon width={30} height={30}/>,
		text: "adsf fasdf",
	},
	{ 
		icon: <SubscriptionsIcon width={30} height={30}/>,
		text: "adsf fasdf",
	},
	{ 
		icon: <SubscriptionsIcon width={30} height={30}/>,
		text: "adsf fasdf"
	}
];

export const Sidebar: FC = () => {
	const { theme, setTheme } = useTheme();
	const changeTheme = () => {
		theme === 'dark' ? setTheme('light') : setTheme('dark');
	}

	return (
		<nav className={style.sidebar}>
			<Link to="/" className='navlink'>
					<div className={style.sidebar_logo} >
						<LogoIcon	width={50} height={50}/>
						<h1 className={style.sidebar_title}>Chain<br />Stalker</h1>
					</div>
			</Link>
			<div className={style.sidebar_options}>
				{
					sidebarOptions.map((option, index) => {
						return <SidebarOption
											key={index} 
											icon={option.icon}
											text={option.text}
											onMouseEnter={option.onMouseEnter}
											onMouseLeave={option.onMouseLeave}
											onClick={option.onClick}/>})
				}
			</div>
			<div className={style.sidebar_footer}>
				<div className={`${style.theme_toogler} btn`} onClick={changeTheme}>
					<ThemeToogler className={style.sidebar_toogler__icon}/>
					<div className={`${style.sidebar_toogler__text} text-normal`}>{theme}</div>
				</div>
				<NavLink to="/login"
					className={({isActive}) => (isActive ? "navlink active" : 'navlink')}>
					<div className={style.sidebar_login}>
						<span className={`text-normal`}>login</span>
						<span>
							<Arrow width={25} height={25} className={style.sidebar_toogler__text}/>
						</span>
					</div>
				</NavLink>
			</div>
		</nav>
	);
}