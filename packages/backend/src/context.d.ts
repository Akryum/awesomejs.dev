import { ApolloContext } from '@nodepack/plugin-apollo'
import { ExpressContext } from '@nodepack/plugin-express'
import { PassportContext } from '@nodepack/plugin-passport'
import { Client } from 'faunadb'
import { Options } from 'npm-registry-fetch'
import Octokit from '@octokit/rest'
import DbConfig from '../config/db'
import GithubConfig from '../config/github'
import ApolloConfig from '../config/apollo'

export interface Config {
  db: typeof DbConfig
  github: typeof GithubConfig
  apollo: typeof ApolloConfig
}

export interface Context extends
  Omit<ApolloContext, 'user'>,
  ExpressContext,
  PassportContext {
  config: Config
  db: Client
  npm: (url: string, opts?: Options) => Promise<any>,
  github: Octokit
}
