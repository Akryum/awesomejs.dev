<script>
import { useQuery } from '@vue/apollo-composable'
import { gql } from 'apollo-server-core'
export default {
  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const { result, loading } = useQuery(gql`
      query releaseCount ($id: ID!) {
        pkg: ${props.pkg.__typename === 'Package' ? 'package' : 'packageProposal'} (id: $id) {
          id
          releaseCount
          tagCount
        }
      }
    `, () => ({
      id: props.pkg.id,
    }))
    return {
      result,
      loading,
    }
  },
}
</script>

<template>
  <div
    v-if="!loading && result.pkg.releaseCount"
    v-tooltip="`<b>${result.pkg.releaseCount}</b> releases<br><b>${result.pkg.tagCount}</b> tags`"
    class="ml-2 text-gray-400 bg-gray-800 text-xs px-1 rounded -mr-2"
  >
    {{ result.pkg.releaseCount }}
  </div>
</template>
