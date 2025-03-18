export class SlugValidator {
	static isSlug(slug: string): boolean {
		return /^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(slug);
	}
}