<script>
import EmptyMessage from '../EmptyMessage.vue'
import PackageAddButton from './PackageAddButton.vue'
import PackageListItem from './PackageListItem.vue'
import LoadingIndicator from '../LoadingIndicator.vue'

import gql from 'graphql-tag'
import { useQuery, useResult } from '@vue/apollo-composable'
import { ref, computed } from '@vue/composition-api'
import mergeWith from 'lodash/mergeWith'
import { pkgFragment } from './fragments'
import { onScrollBottom } from '@/util/scroll'

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
    const { result, loading, fetchMore } = useQuery(gql`
      query ProjectTypePackages ($slug: String!, $tags: [String!], $after: JSON) {
        projectType: projectTypeBySlug (slug: $slug) {
          id
          packages (tags: $tags, after: $after)
              @connection(key: "ProjectTypePackages_packages", filter: ["tags"]) {
            items {
              ...pkg
            }
            after
          }
        }
      }
      ${pkgFragment}
    `, () => ({
      slug: props.projectTypeSlug,
      tags: props.tags,
    }))
    const packages = useResult(result, [], data => data.projectType.packages.items)

    // Pagination
    const afterCursor = computed(() => result.value ? result.value.projectType.packages.after : null)
    const hasMore = computed(() => !!afterCursor.value)
    const loadingMore = ref(false)
    async function loadMore () {
      if (loadingMore.value) return
      if (afterCursor.value) {
        loadingMore.value = true
        await fetchMore({
          variables: {
            after: afterCursor.value,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            return mergeWith({}, previousResult, fetchMoreResult, (target, source, key) => {
              if (key !== 'after' && Array.isArray(target)) {
                return target.concat(source)
              }
            })
          },
        })
        loadingMore.value = false
      }
    }

    // Autoload when scrolling
    const el = ref()
    onScrollBottom(loadMore, el, 600)

    return {
      packages,
      loading,
      hasMore,
      loadMore,
      loadingMore,
      el,
    }
  },
}
</script>

<template>
  <div ref="el">
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
      <BaseButton
        v-if="hasMore"
        :loading="loadingMore"
        class="w-full bg-gray-800 text-purple-300 rounded px-6 py-4 hover:bg-gray-700"
        @click="loadMore()"
      >
        Load more
      </BaseButton>
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
