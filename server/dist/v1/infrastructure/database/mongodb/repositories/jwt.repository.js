export {};
// export class JwtRepository implements IJwtTokensRepository {
// 	public read(id: string) {
// 		try {
// 			const item = JwtTokenModel.findOne({ userId: id });
// 			if (!item) {
// 				throw new NotFoundError(`Jwt Tokens for user <${id}> wasn't found`);
// 			}
// 			return item;
// 		} catch (error: unknown) {
// 			if (error instanceof Error) {
// 				throw error;
// 			}
// 		}
// 	}
// } 
