import { FC } from "react";
import { IconProps } from "../../types/icons";

export const DashboardIcon: FC<IconProps> = ({width, height, className}) => {
	return (
		<svg style={{width: width, height: height}} className={`${className} fill-[var(--fill-color)]`}
		viewBox="0 0 32 32" id="icon" 
		xmlns="http://www.w3.org/2000/svg">
			<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
			<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
			<g id="SVGRepo_iconCarrier">
				<path d="M27,6v5H17V6H27m0-2H17a2,2,0,0,0-2,2v5a2,2,0,0,0,2,2H27a2,2,0,0,0,2-2V6a2,2,0,0,0-2-2Z"></path> 
				<path d="M12,25H6V17h6V15H6a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2h6Z"></path> 
				<polygon points="30 20 16.828 20 19.414 17.414 18 16 13 21 18 26 19.414 24.586 16.828 22 30 22 30 20"></polygon>
				<path d="M11,6v5H6V6h5m0-2H6A2,2,0,0,0,4,6v5a2,2,0,0,0,2,2h5a2,2,0,0,0,2-2V6a2,2,0,0,0-2-2Z"></path> 
				<rect id="_Transparent_Rectangle_" data-name="<Transparent Rectangle>"fill="none" width="32" height="32"></rect>
			</g>
		</svg>
	);
}