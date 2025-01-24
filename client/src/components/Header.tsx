import { Dispatch, FC, SetStateAction } from "react";

import "./Header.css";
import { ThemeIcon } from "./ThemeIcon";
import { LogoIcon } from "./LogoIcon";

interface HeaderProps {
	isDarkTheme: boolean,
	setIsDarkTheme: Dispatch<SetStateAction<boolean>>
}

export const Header: FC<HeaderProps> = ({
	isDarkTheme,
	setIsDarkTheme
}) => {
  const onBtnClick = () => {
    isDarkTheme ?
    setIsDarkTheme(false) :
    setIsDarkTheme(true);
  }
	return (
		<header>
      <LogoIcon isDarkTheme={isDarkTheme}/>
      <p id="header_title">Chain Stalker</p>

			<button className="btn" onClick={onBtnClick}>
				<ThemeIcon isDarkTheme={isDarkTheme}/>
			</button>
		</header>
	);
}