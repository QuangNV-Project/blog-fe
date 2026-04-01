export type AuthExchangeCodeReq = {
    code: string;
    type: string | null;
}

export type LoginMutationResponse = {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user?: UserDto;
}

export type UserDto = {
    id: number
    email: string
    username: string
    firstName: string
    lastName: string
    role: string
    balance: number
    avatar: string
}