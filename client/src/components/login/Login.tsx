import { FC } from "react";

import "./Login.css"
import { LogoIcon } from "../ icons/LogoIcon";


export const Login: FC = () => {
	return (
		<div className="window">
			<div className="content">
				<LogoIcon width={90} height={90}/>
				<h1>Chain<br/>Stalker</h1>
			</div>
			<div className="descr">
				<p className="text-normal">Manage your subscriptions</p>
				<p className="text-small">Connect your telegram and manage your subscriptions easily</p>
				<div className="btn glass_effect text-normal" style={{marginTop: "30px"}}>
					<span>Connect with telegram</span>
				</div>
			</div>
		</div>
	);
};