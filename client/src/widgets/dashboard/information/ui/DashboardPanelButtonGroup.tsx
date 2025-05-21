import { FC } from "react";
import { Button } from "@/shared/ui";


interface ButtonGroupProps {
	disabled: boolean
}

export const DashboardPanelButtonGroup: FC<ButtonGroupProps> = ({
	disabled
}) => {
	return (
		<div className="flex justify-around w-full">
			<Button disabled={disabled} onClick={() => console.log("clicked")} className="w-full">
				<span>Update</span>
			</Button>
			<Button className="w-full">
				<span>Reset</span>
			</Button>
			<Button className="bg-red-700 w-full">
				<span>Delete</span>
			</Button>
		</div>
	);
}