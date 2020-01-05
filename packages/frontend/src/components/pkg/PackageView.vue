<script>
import PackageViewLayout from './PackageViewLayout.vue'
import PackageBookmarkButton from './PackageBookmarkButton.vue'
import PackageReleaseCount from './PackageReleaseCount.vue'
import PackageShareButton from './PackageShareButton.vue'
import RouteTab from '../RouteTab.vue'

import gql from 'graphql-tag'
import { pkgFragment } from './fragments'
import { useQuery, useResult } from '@vue/apollo-composable'
import { computed } from '@vue/composition-api'

export default {
  components: {
    PackageViewLayout,
    PackageBookmarkButton,
    PackageReleaseCount,
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

  setup (props, { root }) {
    const { result, loading } = useQuery(gql`
      query Package ($packageId: ID!) {
        pkg: package (id: $packageId) {
          ...pkg
        }
      }
      ${pkgFragment}
    `, props)
    const pkg = useResult(result)

    const { result: additionalResult } = useQuery(gql`
      query PackageProjectTypes ($packageId: ID!) {
        pkg: package (id: $packageId) {
          id
          projectTypes {
            id
            inTeam
          }
        }
      }
    `, props)
    const inTeam = computed(() => {
      if (additionalResult.value) {
        return additionalResult.value.pkg.projectTypes.some(pt => pt.inTeam)
      }
    })

    return {
      pkg,
      loading,
      inTeam,
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
  <PackageViewLayout
    :pkg="pkg"
    :loading="loading"
  >
    <template #actions>
      <PackageBookmarkButton
        :package-id="pkg.id"
        class="mr-4"
      />

      <PackageShareButton
        :pkg="pkg"
      />
    </template>

    <template #tabs>
      <RouteTab
        :to="{ name: `${routePrefix}package` }"
        class="flex-none"
        exact
      >
        General
      </RouteTab>

      <RouteTab
        :to="{ name: `${routePrefix}package-releases` }"
        class="flex-none"
      >
        Releases
        <PackageReleaseCount
          v-if="!loading"
          :pkg="pkg"
        />
      </RouteTab>

      <RouteTab
        :to="{ name: `${routePrefix}package-insight` }"
        class="flex-none"
      >
        Insight
      </RouteTab>

      <RouteTab
        :to="{ name: `${routePrefix}package-data-sources` }"
        class="flex-none"
      >
        Data sources
      </RouteTab>

      <RouteTab
        v-if="inTeam"
        :to="{ name: `${routePrefix}package-edit` }"
        class="flex-none"
      >
        Edit
      </RouteTab>
    </template>
  </PackageViewLayout>
</template>
