<script>
import LoadingIndicator from '../LoadingIndicator.vue'
import PackageGeneralInfo from './PackageGeneralInfo.vue'
import PackageBookmarkButton from './PackageBookmarkButton.vue'
import PackageShareButton from './PackageShareButton.vue'
import RouteTab from '../RouteTab.vue'

import gql from 'graphql-tag'
import { pkgFragment } from './fragments'
import { useQuery, useResult } from '@vue/apollo-composable'
import { useCurrentUser } from '../user/useCurrentUser'

export default {
  components: {
    LoadingIndicator,
    PackageGeneralInfo,
    PackageBookmarkButton,
    PackageShareButton,
    RouteTab,
  },

  props: {
    packageId: {
      type: String,
      required: true,
    },

    routePrefix: {
      type: String,
      required: true,
    },
  },

  setup (props) {
    const { result, loading } = useQuery(gql`
      query Package ($packageId: ID!) {
        pkg: package (id: $packageId) {
          ...pkg
        }
      }
      ${pkgFragment}
    `, props)
    const pkg = useResult(result)

    return {
      pkg,
      loading,
      isAdmin: useCurrentUser().isAdmin,
    }
  },

  metaInfo () {
    if (!this.pkg) return

    return {
      title: this.pkg.name,
      meta: [
        {
          property: 'og:title',
          content: this.pkg.name,
          vmid: 'og:title',
        },
        {
          property: 'og:description',
          content: this.pkg.description,
          vmid: 'og:description',
        },
      ],
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
        <RouteTab
          :to="{ name: `${routePrefix}package` }"
          exact
        >
          General
        </RouteTab>

        <RouteTab
          :to="{ name: `${routePrefix}package-data-sources` }"
        >
          Data sources
        </RouteTab>

        <RouteTab
          v-if="isAdmin"
          :to="{ name: `${routePrefix}package-edit` }"
        >
          Edit
        </RouteTab>
      </div>

      <div>
        <router-view :pkg="pkg" />
      </div>
    </template>
  </div>
</template>
