import * as Algolia from 'algoliasearch'
import { useSearch } from './algolia'

const client = Algolia('OFCNCOG2CU', 'db283631f89b5b8a10707311f911fd00')

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
