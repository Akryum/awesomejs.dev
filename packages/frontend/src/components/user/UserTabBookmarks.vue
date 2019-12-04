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

  data () {
    return {
      packages: [],
    }
  },

  metaInfo: {
    title: 'My Bookmarks',
  },
}
</script>

<template>
  <div class="mt-8">
    <div class="flex mt-8">
      <div
        v-if="!$responsive.lg || !packageId"
        class="w-full lg:w-1/3 lg:pb-64"
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
              name: 'user-bookmarks-package',
              params: { packageId: pkg.id },
            }"
            :pkg="pkg"
            class="mb-6"
          />
        </template>
      </div>
      <div
        v-if="!$responsive.lg || packageId"
        class="w-full lg:w-2/3 lg:pl-16 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-auto"
      >
        <router-view />
      </div>
    </div>
  </div>
</template>
