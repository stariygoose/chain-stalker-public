import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout/MainLayout";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { LoginPage, NotFoundPage } from "../../pages";

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
				element: (
					<Navigate
						to={"/dashboard"} />
				)
			},
			{
				path: 'login',
				element: <LoginPage />
			},
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