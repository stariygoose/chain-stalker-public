import type { FC } from "react";

interface SVGIconProps {
  Icon: FC<React.SVGProps<SVGSVGElement>>;
  width: number;
  height: number;
  className?: string;
}

export const SVGIcon: FC<SVGIconProps> = ({
  Icon,
  width,
  height,
  className,
}) => {
  return <Icon className={className} width={width} height={height} />;
};
