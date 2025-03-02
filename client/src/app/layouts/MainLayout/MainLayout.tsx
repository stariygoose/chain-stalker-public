import { FC } from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

import { Sidebar } from "@/widgets/";
import { Eye } from "@/features/";

export const MainLayout: FC = () => {
	return (
		<ThemeProvider>
			<Eye />
			<Sidebar />
			<main className="w-full h-screen overflow-hidden">
				<Outlet />
			</main>
		</ThemeProvider>
	);
}