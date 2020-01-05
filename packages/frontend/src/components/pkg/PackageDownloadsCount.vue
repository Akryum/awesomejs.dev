<script>
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import PackageCount from './PackageCount.vue'

export default {
  components: {
    PackageCount,
  },

  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const { result, loading } = useQuery(gql`
      query PackageLastMonthDownloads ($id: ID!) {
        pkg: ${props.pkg.__typename === 'Package' ? 'package' : 'packageProposal'} (id: $id) {
          id
          insight {
            npm {
              downloads (range: month)
            }
          }
        }
      }
    `, () => ({
      id: props.pkg.id,
    }))
    const downloads = useResult(result, null, data => data.pkg.insight.npm.downloads)

    return {
      downloads,
      loading,
    }
  },
}
</script>

<template>
  <PackageCount
    v-if="!loading && downloads != null"
    v-tooltip="'NPM Downloads last month'"
    :count="downloads"
    icon="cloud_download"
  />
</template>
