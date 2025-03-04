import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@/app/layouts/MainLayout/MainLayout";
import { ProtectedRoutes } from "@/app/routing/ProtectedRoutes";
import { LoginPage, NotFoundPage } from "@/pages";
import { dashboardRoutes } from "@/pages/dashboard";

export const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<MainLayout />
		),
		errorElement: <NotFoundPage />,
		children: [
			{
				index: true,
				element: <Navigate to={"/dashboard"} />
			},
			{
				path: 'login',
				element: <LoginPage />
			},
			...dashboardRoutes,
			{
				element: <ProtectedRoutes />,
				children: [
					{
						path: 'test',
						element: <h2>TESTESTSETESTSETSETSETESTS</h2>
					}
				]
			},
			{
				path: '*',
				element: <NotFoundPage />
			}
		]
	}
])