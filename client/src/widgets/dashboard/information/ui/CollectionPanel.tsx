import { ChangeEvent, FC } from "react";
import { DashboardPanelButtonGroup } from "./DashboardPanelButtonGroup";
import { ICollection } from "@/entities/Collection/model/types";
import { Input } from "@/shared/ui";

interface CollectionPanelProps {
	item: ICollection,
	error: string | null,
	handleInput: (e: ChangeEvent<HTMLInputElement>) => void
}

export const CollectionPanel: FC<CollectionPanelProps> = ({
	item,
	error,
	handleInput
}) => {
	const {image, title, percentage} = item;
	return (
		<div className="border max-lg:hidden flex flex-col bg-color-second w-1/3 rounded-2xl
		justify-around p-5 items-center mt-4">
			<div className="size-25">
				{image}
			</div>
			<div className="text-center text-3xl font-extrabold">
				{ title }
			</div>
			<Input title="Percentage %"
				type="text" 
				placeholder={percentage + '%'} 
				className="w-full"
				handleInput={handleInput}
				error={error}
			/>
			<DashboardPanelButtonGroup />
		</div>
	);
}