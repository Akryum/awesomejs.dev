<script>
import LoadingIndicator from '../LoadingIndicator.vue'
import PackageGeneralInfo from './PackageGeneralInfo.vue'
import PackageProposalUpvoteButton from './PackageProposalUpvoteButton.vue'
import PackageProposalApproveButton from './PackageProposalApproveButton.vue'

import gql from 'graphql-tag'
import { useQuery, useResult } from '@vue/apollo-composable'
import { pkgProposalFragment } from './fragments'
import { useCurrentUser } from '../user/useCurrentUser'

export default {
  components: {
    LoadingIndicator,
    PackageGeneralInfo,
    PackageProposalApproveButton,
    PackageProposalUpvoteButton,
  },

  props: {
    packageId: {
      type: String,
      required: true,
    },

    projectTypeId: {
      type: String,
      required: true,
    },
  },

  setup (props) {
    const { result, loading } = useQuery(gql`
      query PackageProposal ($id: ID!) {
        pkg: packageProposal (id: $id) {
          ...pkgProposal
        }
      }
      ${pkgProposalFragment}
    `, () => ({
      id: props.packageId,
    }))
    const pkg = useResult(result)

    return {
      pkg,
      loading,
      currentUser: useCurrentUser().currentUser,
    }
  },

  metaInfo () {
    if (!this.pkg) return

    return {
      title: `[Proposal] ${this.pkg.name}`,
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
        <PackageProposalUpvoteButton
          :pkg="pkg"
          class="mr-4"
        />

        <PackageProposalApproveButton
          v-if="currentUser && currentUser.admin"
          :project-type-id="projectTypeId"
          :proposal="pkg"
          class="px-8 py-4"
        />
      </div>

      <div>
        <router-view :pkg="pkg" />
      </div>
    </template>
  </div>
</template>
