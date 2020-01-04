import { VerifyCallback, Strategy, VerifyFunction } from 'passport-oauth2'
import { query as q, values } from 'faunadb'
import { useStrategy, deserializeUser } from '@nodepack/plugin-passport'
import { hook } from '@nodepack/app-context'
import { Context } from '@/context'
import passport, { AuthenticateOptions } from 'passport'
import fetch from 'node-fetch'
import { mapDocument } from '@/util/fauna'

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
  email?: string
  emails?: Array<{ value: string }>
  photos?: Array<{ value: string }>
  profileUrl?: string
}

const basePath = process.env.BASE_API_PATH || ''
const clientBaseUrl = process.env.CLIENT_BASE_URL || ''

export function use (
  provider: string,
  factory: (verify: VerifyFunction) => Strategy,
  authenticateOptions: AuthenticateOptions,
) {
  hook('expressCreate', (ctx: Context) => {
    const strategy = factory(verifyOAuth(provider, ctx))
    useStrategy(strategy, (context: Context) => {
      context.express.get(
        `${basePath}/auth/${provider}`,
        passport.authenticate(provider, authenticateOptions),
      )

      context.express.get(
        `${basePath}/auth/${provider}/callback`,
        passport.authenticate(provider, {
          failureRedirect: `${clientBaseUrl}/login?error=1`,
        }),
        (req, res) => {
          res.redirect(`${clientBaseUrl}/`)
        },
      )
    })
  })
}

deserializeUser(async (passportCtx, { serialized }) => {
  try {
    const ctx = passportCtx as Context
    const doc = await ctx.db.query<values.Document<any>>(
      q.Get(q.Ref(q.Collection('Users'), serialized)),
    )
    return mapDocument(doc)
  } catch (e) {
    console.error(e)
    return null
  }
})

export function verifyOAuth (provider: string, ctx: Context) {
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
            null,
          ),
        ),
      )
      if (!account) {
        // Create User
        let email: string
        if (!profile.email && (!profile.emails || !profile.emails.length)) {
          // If the user doesn't have any public email
          // we need to fetch the private ones
          const data = await fetch(`https://api.github.com/user/emails`, {
            headers: {
              authorization: `token ${accessToken}`,
            },
          })
          const json = await data.json()
          email = json.find((item: any) => item.primary).email
        } else {
          email = profile.email || profile.emails[0].value
        }
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
              },
            },
          ),
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
              } as UserAccount,
            },
          ),
        )
      } else {
        user = await ctx.db.query(
          q.Get(account.data.userRef),
        )
      }
      done(null, user ? mapDocument(user) : null)
    } catch (err) {
      console.error(err)
      done(err)
    }
  }
}
