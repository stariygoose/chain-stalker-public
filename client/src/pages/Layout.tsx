import { FC } from "react";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export const Layout: FC = () => {
	return (
		<div>
			<Sidebar />
			<main className="window">
				<Outlet />
			</main>
		</div>
	);
}