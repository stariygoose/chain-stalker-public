import { SidebarOptionProps } from "@/widgets/sidebar/ui/SidebarOption";
import {
	DashboardIcon,
	ArrowIcon
} from "@/shared/assets";

export const useSidebarOptions = () => {
	const sidebarOptions: SidebarOptionProps[] = [
		{ 
			icon: <DashboardIcon width={30} height={30}/>,
			text: "Dashboard",
			link: "/dashboard"
		},
		{
			icon: <ArrowIcon width={30} height={30}/>,
			text: "login",
			link: "/login"
		}
	];

	return { sidebarOptions };
}