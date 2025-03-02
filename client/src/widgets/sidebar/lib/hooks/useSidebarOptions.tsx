import { SidebarOptionProps } from "@/widgets/sidebar/ui/SidebarOption";
import {
	DashboardIcon,
	CoinIcon,
	NftIcon,
	ArrowIcon
} from "@/shared/assets";

export const useSidebarOptions = () => {
	const sidebarOptions: SidebarOptionProps[] = [
		{ 
			icon: <DashboardIcon width={30} height={30}/>,
			text: "Dashboard",
			link: "/dashboard/all"
		},
		{ 
			icon: <CoinIcon width={30} height={30}/>,
			text: "Tokens",
			link: "/dashboard/tokens"
		},
		{ 
			icon: <NftIcon width={30} height={30}/>,
			text: "Nfts",
			link: "/dashboard/collections"
		},
		{
			icon: <ArrowIcon width={30} height={30}/>,
			text: "login",
			link: "/login"
		}
	];

	return { sidebarOptions };
}