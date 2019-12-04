<script>
import gql from 'graphql-tag'
import { useQuery, useResult, useQueryLoading } from '@vue/apollo-composable'
import { useCurrentUser } from '../user/useCurrentUser'
import { pkgProposalFragment } from './fragments'

import EmptyMessage from '../EmptyMessage.vue'
import PackageAddButton from './PackageAddButton.vue'
import PackageListItem from './PackageListItem.vue'
import LoadingIndicator from '../LoadingIndicator.vue'
const PackageProposalApproveButton = () => import(
  /* webpackChunkName: "PackageProposalApproveButton.vue" */
  './PackageProposalApproveButton.vue'
)

export default {
  components: {
    EmptyMessage,
    PackageAddButton,
    PackageListItem,
    PackageProposalApproveButton,
    LoadingIndicator,
  },

  props: {
    projectTypeId: {
      type: String,
      required: true,
    },
  },

  setup (props) {
    const { result } = useQuery(gql`
      query ProjectTypePackages ($id: ID!) {
        projectType (id: $id) {
          id
          packageProposals {
            ...pkgProposal
          }
        }
      }
      ${pkgProposalFragment}
    `, () => ({
      id: props.projectTypeId,
    }), {
      fetchPolicy: 'cache-and-network',
    })
    const proposals = useResult(result, [], data => data.projectType.packageProposals)

    return {
      loading: useQueryLoading(),
      proposals,
      currentUser: useCurrentUser().currentUser,
    }
  },
}
</script>

<template>
  <div>
    <LoadingIndicator
      v-if="loading && !proposals.length"
      class="py-8"
    />
    <template v-else-if="proposals.length">
      <PackageListItem
        v-for="pkg of proposals"
        :key="pkg.id"
        :pkg="pkg"
        :to="{
          name: 'package-proposal',
          params: { packageId: pkg.id },
        }"
        class="mb-6"
      >
        <PackageProposalApproveButton
          v-if="currentUser && currentUser.admin"
          :project-type-id="projectTypeId"
          :proposal="pkg"
          :proposals="proposals"
        />
      </PackageListItem>
    </template>
    <EmptyMessage v-else>
      No proposal yet

      <template #cta>
        <PackageAddButton
          class="bg-gray-800 hover:bg-gray-700"
        />
      </template>
    </EmptyMessage>
  </div>
</template>
