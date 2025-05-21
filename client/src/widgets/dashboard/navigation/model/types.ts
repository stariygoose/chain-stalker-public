export const DashboardNavigationOptions = {
	collections: 'collections',
	tokens: 'tokens',
	all: 'dashboard',
} as const;
export type DashboardNavigationOptionsTypes = typeof DashboardNavigationOptions[keyof typeof DashboardNavigationOptions];