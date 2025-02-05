import { FC } from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../../providers/ThemeProvider";

import style from "./MainLayout.module.css"
import { Sidebar } from "../../../widgets";
import { Eye } from "../../../shared/ui/bg/Eye";

export const MainLayout: FC = () => {
	return (
		<ThemeProvider>
			<Eye />
			<Sidebar />
			<div className={style.background}>
				<div className={style.circle}></div>
			</div>
			<main className={style.window}>
				<Outlet />
			</main>
		</ThemeProvider>
	);
}