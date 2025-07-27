import { useTheme } from "@/shared/lib";
import { useEffect, useRef } from "react";

import "./HomePage.css";
import gh_b from "@/pages/home/assets/gh_white.svg";
import gh_w from "@/pages/home/assets/gh_black.svg";
import tg_b from "@/pages/home/assets/tg_black.svg";
import tg_w from "@/pages/home/assets/tg_white.svg";
import { ThemeToggler } from "@/shared";

export const HomePage = () => {
  const { theme, setTheme } = useTheme();
  const telegramBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.querySelector("script[data-telegram-login]")) {
      return;
    }
    // TODO get domain and botName from .env
    // const domain = import.meta.env.VITE_DOMAIN_URL;
    // const botName = import.meta.env.VITE_TG_BOT_NAME;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", "ChainStalkerBot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-auth-url", `https:///api/v1/auth/login`);
    script.setAttribute("data-request-access", "write");

    telegramBtnRef.current?.appendChild(script);
  }, []);

  return (
    <section className="h-screen flex flex-col justify-between items-center">
      <div className="home-bg w-screen h-screen absolute"></div>
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="glass-bg-effect max-w-1/3 flex flex-col justify-center items-center p-3">
          <h1 className="brand-green text-5xl font-bold">Chain Stalker</h1>
          <p className="text-primary mt-3">
            Instant alerts. Total control. No noise — only signal.
          </p>
          <div ref={telegramBtnRef} className="mt-5 m-auto"></div>
          <noscript>
            You must enable javascript to connect your telegram
          </noscript>
        </div>
      </div>
      <div className="glass-bg-effect p-3 border-b-0 rounded-b-none flex justify-between gap-3">
        <ThemeToggler className="w-10 h-10" theme={theme} setTheme={setTheme} />
        <a href="https://github.com/stariygoose/chain-stalker-public">
          <img src={theme === "dark" ? gh_w : gh_b} className="w-10 h-10" />
        </a>
        <a href="https://t.me/ChainStalkerBot">
          <img src={theme === "dark" ? tg_w : tg_b} className="w-10 h-10" />
        </a>
      </div>
    </section>
  );
};
