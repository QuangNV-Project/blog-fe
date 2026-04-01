import { env } from '@/config/env'
import { AuthExchangeCodeReq, LoginMutationResponse } from "@/types/auth"
import { axiosInstance } from "../axios"

/** Absolute URL so OAuth exchange hits the auth service directly (not BFF), independent of axios baseURL. */
const AUTH_API_URL = `${env.BACK_END_URL}/auth/public/auth`

const AUTH_ENDPOINTS = {
    EXCHANGE_AUTH_CODE: `${AUTH_API_URL}/exchange-code`,
}

interface AuthServiceType {
  handleExchangeAuthCode: (data: AuthExchangeCodeReq) => Promise<LoginMutationResponse>
}

export const authService: AuthServiceType = {
  async handleExchangeAuthCode(data: AuthExchangeCodeReq): Promise<LoginMutationResponse> {
    const { data: tokens } = await axiosInstance.post<LoginMutationResponse>(
      AUTH_ENDPOINTS.EXCHANGE_AUTH_CODE,
      data
    )
    return tokens
  },
}