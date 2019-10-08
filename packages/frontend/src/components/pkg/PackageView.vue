<template>
  <div>
    <LoadingIndicator
      v-if="$apollo.queries.pkg.loading"
      class="p-8"
    />
    <template v-else>
      <div
        class="flex items-center pb-4 lg:py-4"
      >
        <PackageLogo
          v-if="!$responsive.sm"
          :pkg="pkg"
          class="mr-6"
        />

        <div class="flex-1 w-0 mr-6 overflow-hidden">
          <div class="w-full truncate text-gray-600">
            <span class="text-gray-100">
              {{ pkg.name }}
            </span>

            <span>
              by {{ pkg.maintainers.map(m => m.name).join(', ') }}
            </span>
          </div>

          <div class="w-full truncate text-gray-500">
            <span>
              {{ parseEmoji(pkg.description) }}
            </span>
          </div>
        </div>

        <a
          :href="pkg.repo"
          target="_blank"
        >
          <PackageCount
            :count="pkg.stars || 0"
          />
        </a>
      </div>

      <div class="mb-4">
        <PackageBookmarkButton
          :package-id="pkg.id"
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
import PackageLogo from './PackageLogo.vue'
import PackageCount from './PackageCount.vue'
import PackageBookmarkButton from './PackageBookmarkButton.vue'
import { parseEmoji } from '@/util/emoji'

import gql from 'graphql-tag'
import { pkg } from './fragments'

export default {
  components: {
    LoadingIndicator,
    PackageLogo,
    PackageCount,
    PackageBookmarkButton,
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

  methods: {
    parseEmoji,
  },
}
</script>
