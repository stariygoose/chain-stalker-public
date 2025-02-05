import { FC } from "react";
import { LogoIcon } from "../../../shared/assets/icons/LogoIcon";

export const NotFoundPage: FC = () => {
	return (
		<>
			<LogoIcon width={200} height={200}/>
			<h1>Not found!</h1>
		</>
	);
}