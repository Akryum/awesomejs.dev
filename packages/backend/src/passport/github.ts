import { use } from './util'
import { Strategy } from 'passport-github2'

use(
  'github',
  (verify) => new Strategy({
    clientID: process.env.OAUTH_GITHUB_ID,
    clientSecret: process.env.OAUTH_GITHUB_SECRET,
    callbackURL: process.env.OAUTH_GITHUB_CALLBACK,
  }, verify),
  {
    scope: ['user:email'],
  },
)
