<script>
import PackageViewLayout from './PackageViewLayout.vue'
import PackageProposalUpvoteButton from './PackageProposalUpvoteButton.vue'
import PackageProposalApproveButton from './PackageProposalApproveButton.vue'
import RouteTab from '../RouteTab.vue'

import gql from 'graphql-tag'
import { useQuery, useResult } from '@vue/apollo-composable'
import { pkgProposalFragment } from './fragments'
import { useCurrentUser } from '../user/useCurrentUser'

export default {
  components: {
    PackageViewLayout,
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

  setup (props, { root }) {
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
  <PackageViewLayout
    :pkg="pkg"
    :loading="loading"
    :error="pkg && !pkg.repo ? 'No GitHub repository found' : null"
  >
    <template #actions>
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
    </template>

    <template #tabs>
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
    </template>
  </PackageViewLayout>
</template>
