<template>
  <div class="mt-8">
    <div class="flex mt-8">
      <div
        v-if="!$responsive.md || !packageId"
        class="w-full lg:w-1/3 lg:pb-64"
      >
        <LoadingIndicator
          v-if="$apollo.loading"
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
        v-if="!$responsive.md || packageId"
        class="w-full lg:w-2/3 lg:pl-16 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-auto"
      >
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { pkg } from '../pkg/fragments'
import LoadingIndicator from '../LoadingIndicator.vue'
import PackageListItem from '../pkg/PackageListItem.vue'

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

  data () {
    return {
      packages: [],
    }
  },

  apollo: {
    packages: {
      query: gql`
        query UserPackageBookmarks {
          currentUser {
            id
            bookmarkedPackages {
              ...pkg
            }
          }
        }
        ${pkg}
      `,
      update: data => data.currentUser.bookmarkedPackages,
    },
  },

  metaInfo: {
    title: 'My Bookmarks',
  },
}
</script>
