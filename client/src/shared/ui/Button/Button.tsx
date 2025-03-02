import { FC, ReactNode } from "react";

interface ButtonProps {
	children: ReactNode,
	onClick?: () => void,
	className?: string,
	disabled?: boolean
}

export const Button: FC<ButtonProps> = ({
	children,
	className,
	onClick,
	disabled = false
}) => {
	return (
		<button
		className={`flex items-center justify-center bg-color-second p-3 mt-3 mr-3
			border cursor-pointer
			hover:bg-color-hover hover:rounded-xl
			transition-all duration-100 ease-in-out
			${className}`}
		onClick={onClick}
		disabled={disabled}
		>
			{children}
		</button>
	);
}