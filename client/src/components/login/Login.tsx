import { FC, useEffect, useRef } from "react";

import "./Login.css"
import { LogoIcon } from "../ icons/LogoIcon";

export const Login: FC = () => {
	const telegramBtnRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (document.querySelector("script[data-telegram-login]")) {
      return;
    }
		
		const domain = import.meta.env.VITE_DOMAIN_URL;
		const botName = import.meta.env.VITE_TG_BOT_NAME;

		console.log(domain)
		console.log(botName)

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botName);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-auth-url", domain);
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