import { ChangeEvent, FC, ReactNode, useEffect, useState } from "react";
import { Input } from "../../../../shared/ui/Input/Input";
import { Button } from "../../../../shared/ui/Button/Button";

interface DashboardInformationProps {
	icon: ReactNode,
	title: string,
	percentage: number
}

export const DashboardInformation: FC<DashboardInformationProps> = ({
	icon,
	title,
	percentage
}) => {
	const [newPersentage, setNewPercentage] = useState<number>(percentage);
	const [error, setError] = useState<string>("");

	const handlePercentageInput = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const numStr = value.replace('%', '');

		const num = parseFloat(numStr);
		if (isNaN(num)) {
			setError("Please enter a valid number");
      return;
		}
		if (num < 0 || num > 1000) {
			setError("Percentage must be between 0 and 1000");
			return ;
		}
		setError("");
		setNewPercentage(num);
	}

	return (
		<div className="max-lg:hidden flex flex-col bg-color-second w-1/3 rounded-2xl
		justify-around p-5 items-center mt-4">
			<div className="size-25 ">
				{icon}
			</div>
			<div className="text-center text-3xl font-extrabold"> { title } </div>
			<Input title="Percentage %" 
				placeholder={5 + '%'} 
				className="w-full"
				handleInput={handlePercentageInput}
				error={error}/>
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
		</div>
	);
}