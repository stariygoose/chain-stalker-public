export const DashboardOptions = {
	collections: 'collections',
	tokens: 'tokens',
	all: 'dashboard',
} as const;
export type DashboardOptionsTypes = typeof DashboardOptions[keyof typeof DashboardOptions];

export interface IDashboardContentOption {
	title: string;
	price: number;
	percentage: number;
	symbol: string;
};