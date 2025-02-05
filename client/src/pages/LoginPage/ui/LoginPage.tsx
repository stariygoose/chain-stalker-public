import { FC, useEffect, useRef } from "react";

import style from "./LoginPage.module.css";
import { LogoIcon } from "../../../shared/assets/icons/LogoIcon";


export const LoginPage: FC = () => {
	const telegramBtnRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (document.querySelector("script[data-telegram-login]")) {
			return;
		}
		
		const domain = import.meta.env.VITE_DOMAIN_URL;
		const botName = import.meta.env.VITE_TG_BOT_NAME;

		const script = document.createElement("script");
		script.src = "https://telegram.org/js/telegram-widget.js?22";
		script.async = true;
		script.setAttribute("data-telegram-login", botName);
		script.setAttribute("data-size", "large");
		script.setAttribute("data-userpic", "false");
		script.setAttribute("data-auth-url", `https://${domain}/api/v1/auth/login`);
		script.setAttribute("data-request-access", "write");
		
		telegramBtnRef.current?.appendChild(script);
	}, []);



	return (
		<div className={style.login}>
			<div className={style.login_wrapper}>
				<div className={style.login_title}>
					<LogoIcon width={90} height={90}/>
					<h1>Chain<br/>Stalker</h1>
				</div>
				<div className={style.login_descr}>
					<p className="text-normal">Manage your subscriptions</p>
					<p className="text-small">Connect your telegram and manage your subscriptions easily</p>
				</div>
				<div ref={telegramBtnRef}	style={{ marginTop: "30px" }}></div>
				<noscript>You must enable javascript to connect your telegram</noscript>
			</div>
			
		</div>
	);
};