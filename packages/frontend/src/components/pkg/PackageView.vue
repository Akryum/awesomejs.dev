<template>
  <div>
    <LoadingIndicator
      v-if="$apollo.queries.pkg.loading"
      class="p-8"
    />
    <template v-else>
      <PackageGeneralInfo
        :pkg="pkg"
      />

      <div class="mb-4 flex overflow-x-auto">
        <PackageBookmarkButton
          :package-id="pkg.id"
          class="mr-4"
        />

        <PackageShareButton
          :pkg="pkg"
        />
      </div>

      <div>
        <router-view :pkg="pkg" />
      </div>
    </template>
  </div>
</template>

<script>
import LoadingIndicator from '../LoadingIndicator.vue'
import PackageGeneralInfo from './PackageGeneralInfo.vue'
import PackageBookmarkButton from './PackageBookmarkButton.vue'
import PackageShareButton from './PackageShareButton.vue'

import gql from 'graphql-tag'
import { pkg } from './fragments'

export default {
  components: {
    LoadingIndicator,
    PackageGeneralInfo,
    PackageBookmarkButton,
    PackageShareButton,
  },

  props: {
    packageId: {
      type: String,
      required: true,
    },
  },

  apollo: {
    pkg: {
      query: gql`
        query Package ($id: ID!) {
          pkg: package (id: $id) {
            ...pkg
          }
        }
        ${pkg}
      `,
      variables () {
        return {
          id: this.packageId,
        }
      },
    },
  },
}
</script>
