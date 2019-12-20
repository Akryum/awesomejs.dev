<script>
import ErrorMessage from '../ErrorMessage.vue'
import LoadingIndicator from '../LoadingIndicator.vue'
import PackageGeneralInfo from './PackageGeneralInfo.vue'
import PackageProposalUpvoteButton from './PackageProposalUpvoteButton.vue'
import PackageProposalApproveButton from './PackageProposalApproveButton.vue'
import RouteTab from '../RouteTab.vue'

import gql from 'graphql-tag'
import { useQuery, useResult } from '@vue/apollo-composable'
import { pkgProposalFragment } from './fragments'
import { useCurrentUser } from '../user/useCurrentUser'

export default {
  components: {
    ErrorMessage,
    LoadingIndicator,
    PackageGeneralInfo,
    PackageProposalApproveButton,
    PackageProposalUpvoteButton,
    RouteTab,
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
      isAdmin: useCurrentUser().isAdmin,
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
          v-if="isAdmin"
          :project-type-id="projectTypeId"
          :proposal="pkg"
          class="px-8 py-4"
        />
      </div>

      <div class="overflow-x-auto flex pb-4 lg:sticky lg:top-0 lg:bg-gray-900 lg:z-10">
        <RouteTab
          :to="{ name: 'package-proposal' }"
          class="flex-none"
          exact
        >
          General
        </RouteTab>

        <RouteTab
          :to="{ name: 'package-proposal-releases' }"
          class="flex-none"
        >
          Releases
        </RouteTab>

        <RouteTab
          :to="{ name: 'package-proposal-data-sources' }"
          class="flex-none"
        >
          Data sources
        </RouteTab>

        <RouteTab
          v-if="isAdmin"
          :to="{ name: 'package-proposal-edit' }"
          class="flex-none"
        >
          Edit
        </RouteTab>
      </div>

      <ErrorMessage
        v-if="!pkg.repo"
        error="No GitHub repository found"
        class="error-box mt-8"
      />

      <div>
        <router-view :pkg="pkg" />
      </div>
    </template>
  </div>
</template>
