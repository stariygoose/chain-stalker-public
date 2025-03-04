import { Button } from "@/shared/ui";

export const DashboardPanelButtonGroup = () => {
	return (
		<div className="flex justify-around w-full">
			<Button className="w-full">
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