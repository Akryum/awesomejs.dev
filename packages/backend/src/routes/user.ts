import { ExpressContext } from '@nodepack/plugin-express'

const basePath = process.env.BASE_API_PATH || ''
const clientBaseUrl = process.env.CLIENT_BASE_URL || ''

export default function ({ express: app }: ExpressContext) {
  app.use(`${basePath}/auth/logout`, (req, res) => {
    req.logout()
    res.redirect(`${clientBaseUrl}/`)
  })
}
