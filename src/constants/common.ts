export const APP_NAME = 'Blog FE'

export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_POST: (id: string | number) => `/blog/${id}`,
  ABOUT: '/about',
  CONTACT: '/contact',
} as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const

export const API_ENDPOINTS = {
  BLOG: {
    LIST: '/blog/posts',
    DETAIL: (id: number) => `/blog/posts/${id}`,
    CREATE: '/blog/posts',
    UPDATE: (id: number) => `/blog/posts/${id}`,
    DELETE: (id: number) => `/blog/posts/${id}`,
  },
} as const

