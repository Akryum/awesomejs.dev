<template>
  <div class="mt-8">
    <div class="flex mt-8">
      <div class="w-1/3">
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
      <div class="w-2/3 pl-16">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { gql } from 'apollo-server-core'
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
}
</script>
