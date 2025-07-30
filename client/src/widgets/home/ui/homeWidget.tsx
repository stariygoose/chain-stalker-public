import { ThemeToggler } from "@/features/theme-toggler";
import { GlassBlock, SocialIcon } from "@/shared";
import { TelegramAuthWidget } from "@/widgets/telegram-auth";

export const HomeWidget = () => {
  return (
    <section className="h-screen flex flex-col justify-between items-center">
      <div className="flex-1 flex items-center justify-center w-full">
        <GlassBlock className="w-full md:max-w-1/3 flex flex-col justify-center items-center p-3">
          <h1 className="text-5xl font-bold">Chain Stalker</h1>
          <p className="text-primary mt-3">
            Instant alerts. Total control. No noise — only signal.
          </p>
          <TelegramAuthWidget />
          <noscript>
            You must enable javascript to connect your telegram
          </noscript>
        </GlassBlock>
      </div>
      <GlassBlock className="p-3 border-b-0 rounded-b-none flex justify-between gap-3">
        <ThemeToggler className="w-10 h-10" />
        <SocialIcon
          href="https://github.com/stariygoose/chain-stalker-public"
          srcLight="/src/pages/home/assets/gh_black.svg?react"
          srcDark="/src/pages/home/assets/gh_white.svg?react"
          alt="GitHub"
        />
        <SocialIcon
          href="https://t.me/ChainStalkerBot"
          srcLight="/src/pages/home/assets/tg_black.svg?react"
          srcDark="/src/pages/home/assets/tg_white.svg?react"
          alt="Telegram Bot"
        />
      </GlassBlock>
    </section>
  );
};
