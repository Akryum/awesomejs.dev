import * as Algolia from 'algoliasearch'
import { ref, isRef, watch } from '@vue/composition-api'

const client = Algolia(process.env.VUE_APP_ALGOLIA_ID, process.env.VUE_APP_ALGOLIA_KEY)

export function getIndex (name) {
  return client.initIndex(name)
}

/** @typedef {import('@vue/composition-api').Ref} Ref */
/** @typedef {import('algoliasearch').QueryParameters} QueryParameters */
/** @typedef {import('algoliasearch').Response} Response */

/**
 * @param {string} indexName
 * @param {QueryParameters | Ref<QueryParameters>} queryParameters
 */
export function useSearch (indexName, queryParameters = {}) {
  const index = getIndex(indexName)
  const searchText = ref('')
  /** @type {Ref<Response>} */
  const result = ref(null)

  watch(searchText, () => search())
  watch(isRef(queryParameters) ? queryParameters : () => queryParameters, () => search(), {
    lazy: true,
    deep: true,
  })

  async function search () {
    const response = await index.search({
      query: searchText.value,
      ...isRef(queryParameters) ? queryParameters.value : queryParameters,
    })
    response.hits.forEach((hit) => {
      hit.id = hit.objectID
    })
    result.value = response
  }

  return {
    searchText,
    result,
    search,
  }
}
