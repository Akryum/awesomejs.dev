<template>
  <div>
    <LoadingIndicator
      v-if="$apollo.loading"
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
      />
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

<script>
import gql from 'graphql-tag'
import { pkgProposal } from './fragments'
import EmptyMessage from '../EmptyMessage.vue'
import PackageAddButton from './PackageAddButton.vue'
import PackageListItem from './PackageListItem.vue'
import LoadingIndicator from '../LoadingIndicator.vue'

export default {
  components: {
    EmptyMessage,
    PackageAddButton,
    PackageListItem,
    LoadingIndicator,
  },

  props: {
    projectTypeId: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      proposals: [],
    }
  },

  apollo: {
    proposals: {
      query: gql`
        query ProjectTypePackages ($id: ID!) {
          projectType (id: $id) {
            id
            packageProposals {
              ...pkgProposal
            }
          }
        }
        ${pkgProposal}
      `,
      variables () {
        return {
          id: this.projectTypeId,
        }
      },
      update: data => data.projectType.packageProposals,
    },
  },
}
</script>
