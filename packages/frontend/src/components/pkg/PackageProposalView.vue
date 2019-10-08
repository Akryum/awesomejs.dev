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
        <PackageProposalUpvoteButton
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
import PackageLogo from './PackageLogo.vue'
import PackageCount from './PackageCount.vue'
import PackageProposalUpvoteButton from './PackageProposalUpvoteButton.vue'

import gql from 'graphql-tag'
import { pkgProposal } from './fragments'
import { parseEmoji } from '@/util/emoji'

export default {
  components: {
    LoadingIndicator,
    PackageLogo,
    PackageCount,
    PackageProposalUpvoteButton,
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
        query PackageProposal ($id: ID!) {
          pkg: packageProposal (id: $id) {
            ...pkgProposal
          }
        }
        ${pkgProposal}
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
