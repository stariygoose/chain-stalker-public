import { ChangeEvent, FC, ReactNode } from "react";
import { Input } from "../../../../shared/ui/Input/Input";
import { Button } from "../../../../shared/ui/Button/Button";
import { useComponentState } from "../../../../shared/lib/hooks/useComponentState";
import { isValidPercentage } from "../lib/helper/isValidPercentage";
import { addZeroAtStart } from "../lib/helper/addZeroAtStart";

interface DashboardInformationProps {
	icon: ReactNode,
	title: string,
	percentage: number
}

interface DashboardInformationState {
	percentage: number
}

export const DashboardInformation: FC<DashboardInformationProps> = ({
	icon,
	title,
	percentage
}) => {
	const { 
		state,
		setState,
		isLoading,
		error,
		setError,
		handleAction
	} = useComponentState<DashboardInformationState>({ percentage });

	const handlePercentageInput = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		let numStr = value.replace('%', '');

		if (numStr.startsWith('0')) {
			numStr = addZeroAtStart(numStr);
		}

		const { isError, errorMessage } = isValidPercentage(numStr);
		if (isError) {
			setError(errorMessage);
			return ;
		}
		const inputValue = parseFloat(numStr)

		setState({ percentage: inputValue });
		setError(null);
	}

	return (
		<div className="max-lg:hidden flex flex-col bg-color-second w-1/3 rounded-2xl
		justify-around p-5 items-center mt-4">
			<div className="size-25">
				{icon}
			</div>
			<div className="text-center text-3xl font-extrabold">
				{ title }
			</div>
			<Input title="Percentage %"
				type="text" 
				placeholder={percentage + '%'} 
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