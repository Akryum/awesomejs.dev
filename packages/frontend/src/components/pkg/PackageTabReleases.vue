<script>
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'

import LoadingIndicator from '../LoadingIndicator.vue'
import PackageRelease from './PackageRelease.vue'

export default {
  components: {
    LoadingIndicator,
    PackageRelease,
  },

  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const { result, loading } = useQuery(gql`
      query PackageReleases ($id: ID!) {
        pkg: package (id: $id) {
          id
          releases {
            id
            date
            title
            tagName
            description
            prerelease
            assets {
              name
              downloadUrl
              size
            }
          }
        }
      }
    `, () => ({
      id: props.pkg.id,
    }))
    const releases = useResult(result, [], data => data.pkg.releases)

    return {
      loading,
      releases,
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
      <PackageRelease
        v-for="release of releases"
        :key="release.id"
        :release="release"
      />
    </div>
  </div>
</template>
