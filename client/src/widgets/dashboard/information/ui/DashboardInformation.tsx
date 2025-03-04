import { ChangeEvent, FC } from "react";
import { useComponentState } from "@/shared/lib/hooks/useComponentState";
import { isValidPercentage } from "@/widgets/dashboard/information/lib/helper/isValidPercentage";
import { addZeroAtStart } from "@/widgets/dashboard/information/lib/helper/addZeroAtStart";
import { DashboardSelectedElement } from "../model/types";
import { EmptyPanel } from "./EmptyPanel";
import { CollectionPanel } from "./CollectionPanel";
import { TokenPanel } from "./TokenPanel";

interface DashboardInformationProps {
	selectedElement: DashboardSelectedElement
}

interface DashboardInformationState {
	percentage: number
}

export const DashboardInformation: FC<DashboardInformationProps> = ({
	selectedElement
}) => {
	const { 
		state,
		setState,
		isLoading,
		error,
		setError,
		handleAction
	} = useComponentState<DashboardInformationState>({
		percentage: selectedElement !== null ? selectedElement.percentage : 0
	});

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

	const renderPanel = (element: DashboardSelectedElement) => {
		if (element === null) {
			return <EmptyPanel />
		}
		switch (element.type) {
			case "collection":
				return <CollectionPanel
					item={element}
					error={error}
					handleInput={handlePercentageInput}
				/>
			case "token":
				return <TokenPanel
					item={element}
					error={error}
					handleInput={handlePercentageInput}
				/>
			default:
				break;
		}
	}

	return (
		renderPanel(selectedElement)
	);
}