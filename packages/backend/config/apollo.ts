import { ApolloConfig } from '@nodepack/plugin-apollo'
import chalk from 'chalk'

const basePath = process.env.BASE_API_PATH || ''

export default {
  path: `${basePath}/graphql`,
  subscriptionsPath: `${basePath}/subscriptions`,
  playground: `${basePath}/playground`,
  apolloServerOptions: {
    formatError: (error) => {
      console.log(chalk.red('Error'), error.stack || error)
      if (error.extensions.exception) {
        console.log(chalk.red('Related exception:'), error.extensions.exception)
      }
      return error
    }
  }
} as ApolloConfig
