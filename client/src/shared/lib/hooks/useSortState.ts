import { useState } from "react";

interface ISortState {
	sortDir: 'asc' | 'desc',
	sortKey: string
}

export const useSortState = (initDir: 'asc' | 'desc', initKey: string) => {
	const [sortState, setSortState] = useState<ISortState>({sortDir: initDir, sortKey: initKey});
	
	const handleDirection = () => {
		if (sortState.sortDir === 'asc') {
			setSortState({...sortState, sortDir: 'desc'});
		} else {
			setSortState({...sortState, sortDir: 'asc'});
		}
	}
	const handleKey = (key: string) => {
		setSortState({...sortState, sortDir: 'desc', sortKey: key});
	}

	const handleSort = (key: string) => {
		if (key === sortState.sortKey) {
			handleDirection();
		} else {
			handleKey(key);
		}
	}

	return {sortState, handleSort};
}