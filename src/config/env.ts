export const env = {
  BACK_END_URL: process.env.NEXT_PUBLIC_BACK_END || 'http://localhost:8080',
  appName: process.env.NEXT_PUBLIC_BLOG_APP_NAME || 'Blog FE',
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL || '',
  TENANT_CODE: process.env.NEXT_PUBLIC_TENANT_CODE || '',
}

