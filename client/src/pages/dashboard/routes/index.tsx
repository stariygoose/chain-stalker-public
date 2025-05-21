import { RouteObject } from "react-router-dom";
import { DashboardPage } from "@/pages/dashboard";
import { CollectionsPage } from "../collections/ui/CollectionsPage";
import { TokensPage } from "../tokens/ui/TokensPage";

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