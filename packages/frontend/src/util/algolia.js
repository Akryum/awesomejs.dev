import { ref, isRef, watch } from '@vue/composition-api'

/** @typedef {import('@vue/composition-api').Ref} Ref */
/** @typedef {import('algoliasearch').QueryParameters} QueryParameters */
/** @typedef {import('algoliasearch').Response} Response */

/**
 * @param {string} indexName
 * @param {QueryParameters | Ref<QueryParameters>} queryParameters
 * @param {QueryParameters} defaultQueryParameters
 * @param {Algolia.Client} algoliaClient
 * @param {any} options Other options
 */
export function useSearch (indexName, queryParameters = {}, defaultQueryParameters = {}, algoliaClient, options = {}) {
  const index = algoliaClient.initIndex(indexName)
  const searchText = ref('')
  /** @type {Ref<Response>} */
  const result = ref(null)

  watch(searchText, () => search())
  watch(isRef(queryParameters) ? queryParameters : () => queryParameters, () => search(), {
    lazy: true,
    deep: true,
  })

  async function search () {
    if (options.skipEmptyQuery && !searchText.value) {
      result.value = null
    } else {
      const response = await index.search({
        query: searchText.value,
        ...defaultQueryParameters,
        ...isRef(queryParameters) ? queryParameters.value : queryParameters,
      })
      response.hits.forEach((hit) => {
        hit.id = hit.objectID
      })
      result.value = response
    }
  }

  return {
    searchText,
    result,
    search,
  }
}
