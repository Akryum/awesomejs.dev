<script>
import EmptyMessage from '../EmptyMessage.vue'
import PackageAddButton from './PackageAddButton.vue'
import PackageListItem from './PackageListItem.vue'
import LoadingIndicator from '../LoadingIndicator.vue'

import gql from 'graphql-tag'
import { useQuery, useResult } from '@vue/apollo-composable'
import { pkgFragment } from './fragments'

export default {
  components: {
    EmptyMessage,
    PackageAddButton,
    PackageListItem,
    LoadingIndicator,
  },

  props: {
    projectTypeSlug: {
      type: String,
      required: true,
    },

    tags: {
      type: Array,
      default: null,
    },
  },

  setup (props) {
    const { result, loading } = useQuery(gql`
      query ProjectTypePackages ($slug: String!, $tags: [String!]) {
        projectType: projectTypeBySlug (slug: $slug) {
          id
          packages (tags: $tags) {
            ...pkg
          }
        }
      }
      ${pkgFragment}
    `, () => ({
      slug: props.projectTypeSlug,
      tags: props.tags,
    }))
    const packages = useResult(result, [], data => data.projectType.packages)

    return {
      packages,
      loading,
    }
  },
}
</script>

<template>
  <div>
    <LoadingIndicator
      v-if="loading && !packages.length"
      class="py-8"
    />
    <template v-else-if="packages.length">
      <PackageListItem
        v-for="pkg of packages"
        :key="pkg.id"
        :to="{
          name: 'package',
          params: { packageId: pkg.id },
        }"
        :pkg="pkg"
        class="mb-4 sm:mb-6"
      />
    </template>
    <EmptyMessage v-else>
      No package yet

      <template #cta>
        <PackageAddButton
          class="bg-gray-800 hover:bg-gray-700"
        />
      </template>
    </EmptyMessage>
  </div>
</template>
