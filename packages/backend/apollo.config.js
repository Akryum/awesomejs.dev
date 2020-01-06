const path = require('path')

// Load .env files
const { loadEnv } = require('vue-cli-plugin-apollo/utils/load-env')
const env = loadEnv([
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '.env.local')
])

module.exports = {
  service: {
    endpoint: {
      url: 'http://localhost:4040/graphql'
    }
  },
  engine: {
    apiKey: env.VUE_APP_APOLLO_ENGINE_KEY
  }
}
