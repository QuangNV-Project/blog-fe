export const env = {
  BACK_END_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Blog FE',
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL || '',
}

