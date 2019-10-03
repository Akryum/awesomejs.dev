import { CorsOptions } from 'cors'

export default {
  origin: process.env.CLIENT_BASE_URL,
  methods: ['OPTIONS', 'POST'],
  credentials: true,
} as CorsOptions
