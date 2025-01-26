import { FC, useEffect, useRef } from "react";

import "./Login.css"
import { LogoIcon } from "../ icons/LogoIcon";


export const Login: FC = () => {
	const telegramBtnRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (document.querySelector("script[data-telegram-login]")) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", "ChainStalkerBot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-auth-url", "https://pretty-casual-hound.ngrok-free.app/");
		script.setAttribute("data-request-access", "write");
    
    telegramBtnRef.current?.appendChild(script);
	}, []);



	return (
		<div className="window">
			<div className="content">
				<div className="btn text-normal">Hosted bot</div>
				<div className="btn text-normal">Custom bot</div>
			</div>				
			<div className="content">
				<LogoIcon width={90} height={90}/>
				<h1>Chain<br/>Stalker</h1>
			</div>
			<div className="descr">
				<p className="text-normal">Manage your subscriptions</p>
				<p className="text-small">Connect your telegram and manage your subscriptions easily</p>
				<div ref={telegramBtnRef}	style={{ marginTop: "30px" }}></div>
				<noscript>You must enable javascript to connect your telegram</noscript>
		</div>
			
		</div>
	);
};