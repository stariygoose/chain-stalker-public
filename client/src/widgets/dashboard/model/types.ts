const DashboardOptions = {
	collections: 'collections',
	tokens: 'tokens',
	all: 'all',
} as const;
export type DashboardTypesKeys = typeof DashboardOptions[keyof typeof DashboardOptions];

export interface IDashboardContentOption {
	title: string;
	price: number;
	percentage: number;
	symbol: string;
};