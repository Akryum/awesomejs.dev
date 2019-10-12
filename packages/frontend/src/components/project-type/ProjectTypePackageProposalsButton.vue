<template>
  <BaseButton
    :to="{
      name: 'project-type-proposals',
      params: {
        projectTypeSlug: projectType && projectType.slug
      }
    }"
    icon-left="thumb_up"
    class="flex items-center bg-gray-800 text-purple-300 rounded px-6 py-4 hover:bg-gray-700"
  >
    <template v-if="$apollo.loading && !projectType">
      Counting proposed packages
    </template>
    <template v-else-if="projectType.packageProposalCount">
      <b class="font-bold ml-2 mr-1">{{ projectType.packageProposalCount }}</b>
      package{{ projectType.packageProposalCount > 1 ? 's' : '' }} proposed
    </template>
    <template v-else>
      No package proposed yet
    </template>
  </BaseButton>
</template>

<script>
import gql from 'graphql-tag'

export default {
  props: {
    projectTypeId: {
      type: String,
      required: true,
    },
  },

  apollo: {
    projectType: {
      query: gql`
        query ProjectTypePackageProposalCount ($id: ID!) {
          projectType (id: $id) {
            id
            slug
            packageProposalCount
          }
        }
      `,
      variables () {
        return {
          id: this.projectTypeId,
        }
      },
      fetchPolicy: 'cache-and-network',
    },
  },
}
</script>
