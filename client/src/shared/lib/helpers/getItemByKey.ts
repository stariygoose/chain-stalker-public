export function getItemByKey<T>(item: T, key: string)
: string | null {
	if (key in (item as Record<string, unknown>)) {
		const res = (item as Record<string, unknown>)[key];
		return res == null || res == undefined ? null : String(res);
	}
	return null;
}