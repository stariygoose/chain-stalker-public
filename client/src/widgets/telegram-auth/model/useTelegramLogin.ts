import { useEffect, type RefObject } from "react";

export const useTelegramLogin = (ref: RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    if (document.querySelector("script[data-telegram-login]")) {
      return;
    }
    // TODO: get domain and botName from .env
    // const domain = import.meta.env.VITE_DOMAIN_URL;
    // const botName = import.meta.env.VITE_TG_BOT_NAME;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", "ChainStalkerBot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-auth-url", `https://api/v1/auth/login`);
    script.setAttribute("data-request-access", "write");

    ref.current?.appendChild(script);
  }, [ref]);
};
