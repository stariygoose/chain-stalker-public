import { FC, useEffect, useRef } from "react";

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
		<div className='h-screen flex items-center justify-center p-3 text-center'>
			<div className="flex flex-col justify-center">
				<div className='flex justify-center items-center'>
					<LogoIcon width={90} height={90}/>
					<h1 className="text-5xl font-bold">Chain<br/>Stalker</h1>
				</div>
				<div className='mt-3 flex flex-col items-center'>
					<p className='text-xl font-bold'>Manage your subscriptions</p>
					<p className='text-sm opacity-70'>Connect your telegram and manage your subscriptions easily</p>
				</div>
				<div ref={telegramBtnRef} className="mt-5 m-auto"></div>
				<noscript>You must enable javascript to connect your telegram</noscript>		
			</div>
		</div>
	);
};