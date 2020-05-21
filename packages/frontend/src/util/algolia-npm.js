import * as Algolia from 'algoliasearch'
import { useSearch } from './algolia'

const client = Algolia(process.env.VUE_APP_ALGOLIA_ID, process.env.VUE_APP_ALGOLIA_KEY)

export function useNpmSearch (queryParameters = {}) {
  return useSearch('npm-search', queryParameters, {
    attributesToRetrieve: [
      'name',
      'description',
      'repository',
      'keywords',
    ],
    hitsPerPage: 10,
  }, client, {
    skipEmptyQuery: true,
  })
}
