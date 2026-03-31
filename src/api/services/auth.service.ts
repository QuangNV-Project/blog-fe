import { env } from "@/config/env"
import { AuthExchangeCodeReq, LoginMutationResponse } from "@/types/auth"
import { axiosInstance } from "../axios"

const AUTH_API_URL = `${env.BACK_END_URL}/auth/public/auth`

const AUTH_ENDPOINTS = {
    EXCHANGE_AUTH_CODE: `${AUTH_API_URL}/exchange-code`,
}

interface AuthServiceType {
    handleExchangeAuthCode: (data: AuthExchangeCodeReq) => Promise<LoginMutationResponse>
}

function unwrapApiResponse<T>(payload: any): T {
    if (payload && typeof payload === 'object' && 'data' in payload) {
      return payload.data as T
    }
    return payload as T
  }

export const authService: AuthServiceType = {
    async handleExchangeAuthCode(data: AuthExchangeCodeReq): Promise<LoginMutationResponse> {
        const response = await axiosInstance.post(AUTH_ENDPOINTS.EXCHANGE_AUTH_CODE, {body: data})
        return unwrapApiResponse<LoginMutationResponse>(response.data)
    },
}