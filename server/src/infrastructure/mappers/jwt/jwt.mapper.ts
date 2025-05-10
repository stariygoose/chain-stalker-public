import { UserDbRecord } from "#infrastructure/dtos/user/user.dto.js";

type UserPayload = {
	userId: number;
}

export class JwtMapper {
	public static toDomain(payload: UserDbRecord): UserPayload {
		return {
			userId: payload.userId
		}
	}
}