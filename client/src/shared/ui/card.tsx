import type { FC } from "react";

interface ICardProps {
  title: string;
  description: string;
  footer?: string;
  cardClass?: string;
  titleClass?: string;
  descriptionClass?: string;
  footerClass?: string;
}

export const Card: FC<ICardProps> = ({
  title,
  description,
  footer,
  cardClass,
  titleClass,
  descriptionClass,
  footerClass,
}) => {
  return (
    <div className={cardClass ?? "bg-secondary p-5 rounded-xl"}>
      <p className={titleClass ?? "text-base mb-3"}>{title}</p>
      <p className={descriptionClass ?? "font-bold text-2xl"}>{description}</p>
      <span className={footerClass ?? "text-green-light"}>{footer}</span>
    </div>
  );
};
