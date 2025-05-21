import { useState } from "react"

export const useComponentState = <T>(initialState: T) => {
	const [state, setState] = useState<T>(initialState);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleAction = async (action: () => Promise<T>) => {
		try {
			setIsLoading(true);
			const result = await action();
			setState(result);
		} catch (error: unknown) {
			if (error instanceof Error) {
				setError(error.message);
			}
		} finally {
			setIsLoading(false);
		}
	}

	return { state, setState, isLoading, error, setError, handleAction };
}