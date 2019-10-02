import { ApolloConfig } from '@nodepack/plugin-apollo'

const basePath = process.env.APOLLO_PATH || ''

export default {
  path: `${basePath}/graphql`,
  subscriptionsPath: `${basePath}/subscriptions`,
  playground: `${basePath}/playground`
} as ApolloConfig
