import { FC } from "react";
import { IconProps } from "../../types/icons";


export const SubscriptionsIcon: FC<IconProps> = ({ width = 50, height = 50, color, className }) => {
	return (
		<svg className={className} fill={color} width={width + "px"} height={height + "px"} viewBox="0 0 16.00 16.00" 
		xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="0.00016">
			<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
			<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
			<g id="SVGRepo_iconCarrier">
				<path d="M12.5 1h-9l-.5.5v13l.872.335L8 10.247l4.128 4.588L13 14.5v-13l-.5-.5zM12 13.2L8.372 9.165h-.744L4 13.2V2h8v11.2z"></path>
			</g>
		</svg>
	);
}