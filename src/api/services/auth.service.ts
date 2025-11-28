import { env } from "@/config/env"
import { AuthExchangeCodeReq, LoginMutationResponse } from "@/types/auth"

const AUTH_API_URL = `${env.BACK_END_URL}/api/auth/public/auth`

const AUTH_ENDPOINTS = {
    EXCHANGE_AUTH_CODE: `${AUTH_API_URL}/exchange-code`,
}

interface AuthServiceType {
    handleExchangeAuthCode: (data: AuthExchangeCodeReq) => Promise<LoginMutationResponse>
}

export const authService: AuthServiceType = {
    async handleExchangeAuthCode(data: AuthExchangeCodeReq): Promise<LoginMutationResponse> {
        try {
            const res = await fetch(`${AUTH_ENDPOINTS.EXCHANGE_AUTH_CODE}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                cache: 'no-store',
            })
            const json = await res.json() as { data: LoginMutationResponse }
            return json.data
        } catch (error) {
            console.log(error)
            throw error
        }
    },
}