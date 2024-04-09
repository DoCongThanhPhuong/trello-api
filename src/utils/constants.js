import { env } from '~/config/environment'

export const WHITELIST_DOMAINS = [
  // 'http://localhost:5173'
  'https://trello-web-black.vercel.app'
]

export const BOARD_TYPES = { PUBLIC: 'public', PRIVATE: 'private' }

export const WEBSITE_DOMAIN =
  env.BUILD_MODE === 'production'
    ? 'https://trello-web-black.vercel.app'
    : 'http://localhost:5173'
