import { ref, watch } from '@vue/composition-api'
import { getIndex } from '@/util/algolia'

/** @typedef {import('@vue/composition-api').Ref} Ref */
/** @typedef {import('algoliasearch').QueryParameters} QueryParameters */
/** @typedef {import('algoliasearch').Response} Response */

/**
 * @param {string} indexName
 * @param {QueryParameters} queryParameters
 */
export function useSearch (indexName, queryParameters) {
  const index = getIndex(indexName)
  const searchText = ref('')
  /** @type {Ref<Response>} */
  const result = ref(null)

  watch(searchText, () => search())

  async function search () {
    const response = await index.search({
      query: searchText.value,
      ...queryParameters,
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
