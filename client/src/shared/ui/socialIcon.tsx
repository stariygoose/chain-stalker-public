import { useThemeStore } from "@/app/model/theme.store";

interface Props {
  href: string;
  srcDark: string;
  srcLight: string;
  alt: string;
}

export const SocialIcon = ({ href, srcDark, srcLight, alt }: Props) => {
  const { theme } = useThemeStore();

  return (
    <a href={href}>
      <img
        src={theme === "dark" ? srcDark : srcLight}
        className="w-10 h-10 stroke-white"
        alt={alt}
      />
    </a>
  );
};
