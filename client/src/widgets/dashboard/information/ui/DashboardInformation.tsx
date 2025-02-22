import { FC, ReactNode } from "react";

interface DashboardInformationProps {
	icon: ReactNode,
	title: string,
}

export const DashboardInformation: FC<DashboardInformationProps> = ({
	icon,
	title
}) => {
	return (
		<div className="max-lg:hidden flex flex-col">
			<div className="w-auto h-full">
				{icon}
			</div>
			<div className="text-center"> { title } </div>
		</div>
	);
}