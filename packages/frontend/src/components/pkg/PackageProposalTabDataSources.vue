<script>
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import LoadingIndicator from '../LoadingIndicator.vue'
import PackageDataSource from './PackageDataSource.vue'

export default {
  components: {
    LoadingIndicator,
    PackageDataSource,
  },

  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const { result, loading } = useQuery(gql`
      query PackageDataSources ($id: ID!) {
        pkg: packageProposal (id: $id) {
          id
          dataSources {
            type
            data
          }
        }
      }
    `, () => ({
      id: props.pkg.id,
    }))
    const dataSources = useResult(result, [], data => data.pkg.dataSources)

    return {
      loading,
      dataSources,
    }
  },
}
</script>

<template>
  <div class="mt-4">
    <LoadingIndicator
      v-if="loading"
      class="p-8"
    />

    <div>
      <PackageDataSource
        v-for="dataSource of dataSources"
        :key="dataSource.type"
        :data-source="dataSource"
      />
    </div>
  </div>
</template>
