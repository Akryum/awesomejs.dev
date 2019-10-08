import * as Algolia from 'algoliasearch'

const client = Algolia(process.env.VUE_APP_ALGOLIA_ID, process.env.VUE_APP_ALGOLIA_KEY)

export function getIndex (name) {
  return client.initIndex(name)
}
