import { FC, useState } from "react";
import { DashboardNavigation } from "../../../widgets/dashboard/navigation/ui/DashboardNavigation";
import { DashboardTypesKeys, IDashboardContentOption } from "../../../widgets/dashboard/model/types";
import { DashboardContent } from "../../../widgets/dashboard/content/ui/DashboardContent";
import { DashboardInformation } from "../../../widgets/dashboard/information/ui/DashboardInformation";
import { CoinIcon } from "../../../shared/assets/icons/CoinIcon";


export const DashboardPage: FC = () => {
	const [activeTab, setActiveTab] = useState<DashboardTypesKeys>('collections');
	const [sortKey, setSortKey] = useState<keyof IDashboardContentOption>('title');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	const collections = [
		{ title: 'Collection 1', price: 100, percentage: 10, symbol: 'ETH' },
		{ title: 'Collection 1', price: 1232, percentage: 1, symbol: 'ETH' },
		{ title: 'Collection 1', price: 100, percentage: 10, symbol: 'SOL' },
		{ title: 'Collection 1', price: 102130, percentage: 10, symbol: 'SOL' },
		{ title: 'Collection 1', price: 100, percentage: 132, symbol: 'SOL' },
		{ title: 'Collection 1', price: 1, percentage: 10, symbol: 'SOL' },
		{ title: 'Collection 1', price: 100, percentage: 10, symbol: 'SOL' },
		{ title: 'Collection 1', price: 1312300, percentage: 10, symbol: 'SOL' },
		{ title: 'Collection 1', price: 1231200, percentage: 10, symbol: 'OP' },
		{ title: 'Collection 1', price: 100, percentage: 10, symbol: 'OP' },
		{ title: 'Collection 1', price: 1312300, percentage: 110, symbol: 'OP' },
		{ title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
		{ title: 'Collection 1', price: 100, percentage: 10000, symbol: 'ZK' },
		{ title: 'Collection 1', price: 13123100, percentage: 10, symbol: 'ZK' },
		{ title: 'Collection 1', price: 1100, percentage: 10, symbol: 'ZK' },
		{ title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
		{ title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
		{ title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
		{ title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
		{ title: 'Collection 1', price: 100, percentage: 10, symbol: 'ZK' },
	];

  const handleSort = (key: keyof IDashboardContentOption) => {
		if (sortKey === key) {
				setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		} else {
				setSortKey(key);
				setSortOrder('asc');
		}
};

	const sortedContent = [...collections].sort((a, b) => {
		if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
		if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
		return 0;
	});

	const renderContent = () => {
		switch (activeTab) {
			case 'collections': return <DashboardContent content={sortedContent} handleSort={handleSort}/>;
			case 'tokens': return <h1>Tokens</h1>;
			case 'all': return <h1>All</h1>;
			default: return <h1>Default</h1>;
		};
	};

	return ( 
		<section className="w-[calc(100%-180px)] h-screen max-sm:size-full max-sm:p-2 p-5 mx-auto">
			<h1 className="text-4xl font-bold max-sm:text-center">Dashboard</h1>
			<DashboardNavigation activeTab={activeTab} changeActiveTab={setActiveTab}/>
			<div className="flex justify-between">
				<div className="h-[calc(100vh-150px)] max-lg:w-full overflow-y-auto" style={{scrollbarWidth: 'none'}}>
					{ renderContent() }
				</div>
				<DashboardInformation title={'Collection 1'}
					icon={<CoinIcon/>}
					percentage={5}/>
			</div>
		</section>
	);
};