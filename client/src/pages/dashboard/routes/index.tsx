import { RouteObject } from "react-router-dom";
import { DashboardPage } from "@/pages/dashboard";
import { CollectionsPage } from "@/pages/dashboardPage";
import { TokensPage } from "@/pages/dashboardTokens";

export const dashboardRoutes: RouteObject[] = [
	{
		path: 'dashboard',
		element: <DashboardPage />,
		children: [
			{
				path: 'collections',
				element: <CollectionsPage />,
			},
			{
				path: 'tokens',
				element: <TokensPage />
			}
		]
	}
]