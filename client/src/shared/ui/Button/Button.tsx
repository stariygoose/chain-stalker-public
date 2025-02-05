import { FC, ReactNode } from "react";

interface ButtonProps {
	children: ReactNode,
	className: string
}

export const Button: FC<ButtonProps> = ({ children, className }) => {
	return (
		<div
		className={`flex items-center justify-center bg-color-second p-3 mt-3 mr-3
			border cursor-pointer
			hover:bg-color-hover hover:rounded-xl
			transition-all duration-100 ease-in-out
			${className}` }
			>
			{children}
		</div>
	);
}