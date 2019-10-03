import { VerifyCallback, Strategy, VerifyFunction } from 'passport-oauth2'
import { query as q, values } from 'faunadb'
import { UserAccount } from './util'
import { useStrategy, deserializeUser } from '@nodepack/plugin-passport'
import { hook } from '@nodepack/app-context'
import { Context } from '@/context'
import passport, { AuthenticateOptions } from 'passport'

export interface UserAccount {
  provider: string
  profileId: string
  userRef: values.Ref
  nickname?: string
  profileUrl?: string
  accessToken?: string
  refreshToken?: string
}

export interface OAuthProfile {
  id: string
  username?: string
  displayName?: string
  emails?: ({ value: string })[]
  photos?: ({ value: string })[]
  profileUrl?: string
}

const basePath = process.env.BASE_API_PATH || ''
const clientBaseUrl = process.env.CLIENT_BASE_URL || ''

export function use (provider: string, factory: (verify: VerifyFunction) => Strategy, authenticateOptions: AuthenticateOptions) {
  hook('expressCreate', (ctx: Context) => {
    const strategy = factory(verifyOAuth(provider, ctx))
    useStrategy(strategy, (ctx: Context) => {
      ctx.express.get(
        `${basePath}/auth/${provider}`,
        passport.authenticate(provider, authenticateOptions)
      )
  
      ctx.express.get(
        `${basePath}/auth/${provider}/callback`,
        passport.authenticate(provider, {
          failureRedirect: `${clientBaseUrl}/login?error=1`
        }),
        (req, res) => {
          res.redirect(`${clientBaseUrl}/`)
        }
      )
    })
  })
}

deserializeUser(async (passportCtx, { serialized }) => {
  try {
    const ctx = passportCtx as Context
    const { ref: { id }, data } = await ctx.db.query(
      q.Get(q.Ref(q.Collection('Users'), serialized))
    )
    return {
      id,
      ...data,
    }
  } catch (e) {
    console.error(e)
    return null
  }
})

export function verifyOAuth (provider: String, ctx: Context) {
  return async (accessToken: string, refreshToken: string, profile: OAuthProfile, done: VerifyCallback) => {
    try {
      let user: values.Document
      let account: values.Document<UserAccount> = await ctx.db.query(
        q.Let(
          {
            ref: q.Match(q.Index('useraccounts_by_provider_and_profileid'), provider, profile.id),
          },
          q.If(
            q.Exists(q.Var('ref')),
            q.Get(q.Var('ref')),
            null
          )
        )
      )
      if (!account) {
        // Create User
        if (!profile.emails.length) {
          throw new Error(`No email found in profile`)
        }
        const email = profile.emails[0].value
        const avatar = profile.photos.length ? profile.photos[0].value : null
        const nickname = profile.displayName || profile.username
        
        user = await ctx.db.query(
          q.Create(
            q.Collection('Users'),
            {
              data: {
                email,
                avatar,
                nickname,
              }
            }
          )
        )
  
        account = await ctx.db.query(
          q.Create(
            q.Collection('UserAccounts'),
            {
              data: {
                provider,
                profileId: profile.id,
                userRef: user.ref,
                nickname,
                profileUrl: profile.profileUrl,
                accessToken,
                refreshToken,
              } as UserAccount
            }
          )
        )
      } else {
        user = await ctx.db.query(
          q.Get(account.data.userRef)
        )
      }
      done(null, user ? {
        id: user.ref.id,
        ...user.data,
      } : null)
    } catch (err) {
      console.error(err)
      done(err)
    }
  }
}
