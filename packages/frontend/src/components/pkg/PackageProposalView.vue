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
import PackageGeneralInfo from './PackageGeneralInfo.vue'
import PackageProposalUpvoteButton from './PackageProposalUpvoteButton.vue'

import gql from 'graphql-tag'
import { pkgProposal } from './fragments'

export default {
  components: {
    LoadingIndicator,
    PackageGeneralInfo,
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
}
</script>
