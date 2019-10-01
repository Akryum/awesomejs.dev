import { ApolloContext } from '@nodepack/plugin-apollo'
import { ExpressContext } from '@nodepack/plugin-express'
import { PassportContext } from '@nodepack/plugin-passport'
import { Client } from 'faunadb'
import NpmFetch from 'npm-registry-fetch'
import DbConfig from '../config/db'

export interface Config {
  db: typeof DbConfig
}

export interface Context extends
  Omit<ApolloContext, 'user'>,
  ExpressContext,
  PassportContext {
  config: Config
  db: Client
  npm: typeof NpmFetch
}
