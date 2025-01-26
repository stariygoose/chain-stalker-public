import { FC, useEffect, useRef } from "react";

import "./Login.css"
import { LogoIcon } from "../ icons/LogoIcon";


export const Login: FC = () => {
	const telegramBtnRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (document.querySelector("script[data-telegram-login]")) {
      console.log("Telegram script is already loaded");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", "ChainStalkerBot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-user-pic", "false");
    script.setAttribute("data-auth-url", "https://google.com");
    
    telegramBtnRef.current?.appendChild(script);
    console.log("Telegram script loaded successfully");
	}, []);


	return (
		<div className="window">
			<div className="content">
				<LogoIcon width={90} height={90}/>
				<h1>Chain<br/>Stalker</h1>
			</div>
			<div className="descr">
				<p className="text-normal">Manage your subscriptions</p>
				<p className="text-small">Connect your telegram and manage your subscriptions easily</p>
				<div ref={telegramBtnRef} className="btn glass_effect text-normal" 
							style={{ marginTop: "30px" }}>
					<span>Connect with telegram</span>
				</div>

				<noscript>You must enable javascript to connect your telegram</noscript>
			</div>
		</div>
	);
};