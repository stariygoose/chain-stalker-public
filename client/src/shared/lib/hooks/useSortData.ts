import { useState } from "react";

interface ISortState {
	sortDir: 'asc' | 'desc',
	sortKey: string
}

export const useSortData = (initDir: 'asc' | 'desc', initKey: string) => {
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

	const sortData = <T>(data: T[]) => {
		return [...data].sort((a, b) => {
			const aValue = a[sortState.sortKey as keyof typeof a];
			const bValue = b[sortState.sortKey as keyof typeof b];
	
			if (typeof aValue === 'string' && typeof bValue === 'string') {
				return sortState.sortDir === 'asc'
						? aValue.localeCompare(bValue)
						: bValue.localeCompare(aValue)
			}
	
			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return sortState.sortDir === 'asc'
						? aValue - bValue
						: bValue - aValue
			}
	
			return 0;
		});
	}

	return { handleSort, sortData };
}