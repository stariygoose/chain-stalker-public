import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@/app/layouts/MainLayout/MainLayout";
import { ProtectedRoutes } from "@/app/routing/ProtectedRoutes";
import { DashboardPage, LoginPage, NotFoundPage } from "@/pages";
import { TokensPage } from "@/pages/TokensPage/ui/TokensPage";
import { CollectionsPage } from "@/pages/CollectionsPage/ui/CollectionsPage";

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
				element: <Navigate to={"/dashboard/all"} />
			},
			{
				path: 'login',
				element: <LoginPage />
			},
			{
				path: 'dashboard',
				element: <DashboardPage />,
				children: [
					{
						path: 'all',
						element: 'TODO',
					},
					{
						path: 'collections',
						element: <CollectionsPage />,
					},
					{
						path: 'tokens',
						element: <TokensPage />
					}
				]
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