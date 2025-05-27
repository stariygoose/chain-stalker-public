import { FC } from "react";
import { Link } from "react-router-dom";

import { LogoIcon } from "@/shared/assets/icons/LogoIcon";
import { Button } from "@/shared/ui/";
import { ArrowIcon } from "@/shared/assets/icons/ArrowIcon";

export const NotFoundPage: FC = () => {
	return (
		<div className="h-screen flex items-center justify-center">
			<LogoIcon width={200} height={200}/>
			<div className="flex flex-col">
				<h1 className="max-sm:text-3xl text-5xl font-bold">Not found!</h1>
				<Link to="/" className="group">
					<Button className="max-sm:w-[120px]  w-[190px] h-[50px]">
						<span className="max-sm:text-sm max-sm:font-normal font-bold text-xl 
						max-sm:m-0 m-4 group-hover:animate-pulse">To Dashboard</span>
						<ArrowIcon width={20} height={20} className="group-hover:animate-pulse"/>
					</Button>
				</Link>
			</div>
		</div>	
	);
}