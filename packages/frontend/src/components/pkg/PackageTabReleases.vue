<script>
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { releaseFragment } from './fragments'

import EmptyMessage from '../EmptyMessage.vue'
import LoadingIndicator from '../LoadingIndicator.vue'
import PackageRelease from './PackageRelease.vue'

export default {
  components: {
    EmptyMessage,
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
    const { result, loading } = useQuery(() => gql`
      query PackageReleases ($id: ID!) {
        pkg: ${props.pkg.__typename === 'Package' ? 'package' : 'packageProposal'} (id: $id) {
          id
          releases {
            ...release
          }
        }
      }
      ${releaseFragment}
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
  <div>
    <LoadingIndicator
      v-if="loading"
      class="p-8"
    />

    <div v-else>
      <PackageRelease
        v-for="release of releases"
        :key="release.id"
        :release="release"
      />

      <EmptyMessage
        v-if="!releases.length"
        icon="access_time"
      >
        No releases found
      </EmptyMessage>
    </div>
  </div>
</template>
