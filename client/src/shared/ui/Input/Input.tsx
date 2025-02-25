import { ChangeEvent, FC, useState } from "react";

interface InputProps {
	title: string,
	placeholder?: string,
	className?: string,
	handleInput?: (e: ChangeEvent<HTMLInputElement>) => void,
	error?: string
}

export const Input:FC<InputProps> = ({
	title,
	placeholder = "",
	className = "",
	handleInput,
	error
}) => {
	const [isFilled, setIsFilled] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(false);

	const onFocus = () => {
		setIsFocused(true);
	}
	
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setIsFilled(!!value);
		handleInput(e);
	}

	const onBlur = () => {
		setIsFocused(false);
	}

	return (
		<label className={`relative cursor-pointer ${className}`}>
			<input type="text"
					className={`border-2 box-border block w-full p-1 
					bg-transparent rounded-2xl
					focus:outline-none
					peer ${error ? 'border-red-800' : 'border-amber-100'}`}
					placeholder={isFocused ? placeholder : ""}
					onFocus={onFocus}
					onChange={onChange}
					onBlur={onBlur}/>
			<span id="percentage-input"
					className={`absolute top-0 left-0 p-1 m-1 whitespace-nowrap
				transform-property: translate-0 leading-tight bg-color-second
				rounded-2xl transition-all duration-100 easy-in
				${isFilled 
					? 'translate-x-5 translate-y-[-65%] scale-75'
					: "peer-focus:translate-x-5 peer-focus:translate-y-[-65%] peer-focus:scale-75"}`}>
					{error ? error : title }
				</span>
		</label>
	);
}