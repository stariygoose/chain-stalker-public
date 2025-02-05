import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout/MainLayout";
import { LoginPage } from "../../pages/LoginPage";
import { NotFoundPage } from "../../pages/NotFoundPage";
import { ProtectedRoutes } from "./ProtectedRoutes";

export const router = createBrowserRouter([
	{
		path: '/',
		element: (
				<MainLayout />
		),
		errorElement: <NotFoundPage />,
		children: [
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
			}
		]
	}
])