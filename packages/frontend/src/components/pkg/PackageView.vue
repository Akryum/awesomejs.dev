<template>
  <div>
    <LoadingIndicator
      v-if="$apollo.queries.pkg.loading"
      class="p-8"
    />
    <template v-else>
      <div
        class="flex items-center py-4"
      >
        <PackageLogo
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
              {{ pkg.description }}
            </span>
          </div>
        </div>

        <a
          :href="pkg.repo"
          target="_blank"
        >
          <PackageStars
            :count="pkg.stars"
          />
        </a>
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
import PackageStars from './PackageStars.vue'

import gql from 'graphql-tag'
import { pkg } from './fragments'

export default {
  components: {
    LoadingIndicator,
    PackageLogo,
    PackageStars,
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
