<script>
import LoadingIndicator from '../LoadingIndicator.vue'
import PackageListItem from '../pkg/PackageListItem.vue'

import gql from 'graphql-tag'
import { useQuery, useResult } from '@vue/apollo-composable'
import { pkgFragment } from '../pkg/fragments'

export default {
  components: {
    LoadingIndicator,
    PackageListItem,
  },

  props: {
    user: {
      type: Object,
      required: true,
    },

    packageId: {
      type: String,
      default: null,
    },
  },

  setup () {
    const { result, loading } = useQuery(gql`
      query UserPackageBookmarks {
        currentUser {
          id
          bookmarkedPackages {
            ...pkg
          }
        }
      }
      ${pkgFragment}
    `)
    const packages = useResult(result, [], data => data.currentUser.bookmarkedPackages)

    return {
      packages,
      loading,
    }
  },

  metaInfo: {
    title: 'My Bookmarks',
  },
}
</script>

<template>
  <div>
    <div class="flex">
      <div
        v-if="!$responsive.lg || !packageId"
        class="w-full lg:w-1/3 lg:pb-64 lg:mt-4 lg:sticky lg:top-4 lg:max-h-screen lg:overflow-y-auto"
      >
        <LoadingIndicator
          v-if="loading"
          class="py-8"
        />
        <template v-else>
          <PackageListItem
            v-for="pkg of packages"
            :key="pkg.id"
            :to="{
              name: $route.path.includes('/pkg/') && $route.params.packageId !== pkg.id ? undefined : 'user-bookmarks-package',
              params: { packageId: pkg.id },
            }"
            :pkg="pkg"
            class="mb-6"
          />
        </template>
      </div>
      <div
        v-if="!$responsive.lg || packageId"
        class="w-full lg:w-2/3 lg:pl-16"
      >
        <router-view />
      </div>
    </div>
  </div>
</template>
