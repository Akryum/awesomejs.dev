<script>
import gql from 'graphql-tag'
import { useQuery, useResult } from '@vue/apollo-composable'

export default {
  props: {
    projectTypeId: {
      type: String,
      required: true,
    },
  },

  setup (props) {
    const { result, loading } = useQuery(gql`
      query ProjectTypePackageProposalCount ($id: ID!) {
        projectType (id: $id) {
          id
          slug
          packageProposalCount
        }
      }
    `, () => ({
      id: props.projectTypeId,
    }), {
      fetchPolicy: 'cache-and-network',
    })
    const projectType = useResult(result)

    return {
      projectType,
      loading,
    }
  },
}
</script>

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
    <template v-if="loading && !projectType">
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
