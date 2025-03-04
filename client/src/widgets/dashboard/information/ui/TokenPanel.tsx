import { ChangeEvent, FC } from "react";
import { IToken } from "@/entities/Token/model/types";
import { Input } from "@/shared/ui";
import { DashboardPanelButtonGroup } from "./DashboardPanelButtonGroup";

interface TokenPanelProps {
	item: IToken,
	error: string | null,
	handleInput: (e: ChangeEvent<HTMLInputElement>) => void
}

export const TokenPanel: FC<TokenPanelProps> = ({
	item,
	error,
	handleInput
}) => {
	const { symbol, percentage } = item;
	return (
		<div className="border max-lg:hidden flex flex-col bg-color-second w-1/3 rounded-2xl
		justify-around p-5 items-center mt-4">
			<div className="text-center text-6xl font-extrabold">
				{ symbol }
			</div>
			<div className="w-full flex flex-col gap-5">
				<Input title="Percentage %"
					type="text" 
					placeholder={percentage + '%'} 
					className="w-full"
					handleInput={handleInput}
					error={error}
				/>
				<DashboardPanelButtonGroup />
			</div>
		</div>
	);
}