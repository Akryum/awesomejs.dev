<script>
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useCurrentUser } from '../user/useCurrentUser'

export default {
  props: {
    projectType: {
      type: Object,
      required: true,
    },

    selected: {
      type: Boolean,
      default: false,
    },
  },

  setup (props) {
    const { isAdmin, loading: userLoading } = useCurrentUser()

    const { result } = useQuery(gql`
      query ProjectTypePackageProposalCount ($id: ID!) {
        projectType (id: $id) {
          id
          slug
          packageProposalCount
        }
      }
    `, () => ({
      id: props.projectType.id,
    }), () => ({
      fetchPolicy: 'cache-and-network',
      enabled: !userLoading.value && isAdmin.value,
    }))
    const packageProposalCount = useResult(result, 0, data => data.projectType.packageProposalCount)

    return {
      packageProposalCount,
    }
  },
}
</script>

<template>
  <div
    class="
    flex flex-col items-center justify-center p-2 bg-gray-800 rounded
    w-24 h-24 lg:w-32 lg:h-32 cursor-pointer relative
    hover:bg-gray-700
    "
    :class="{
      'text-purple-200 bg-purple-800 hover:bg-purple-700': selected,
    }"
  >
    <div
      class="w-8 lg:w-16 flex items-center justify-center flex-1"
    >
      <img
        :src="projectType.logo"
        :alt="`${projectType.name} logo`"
        class="max-w-full max-h-full rounded"
      >
    </div>

    <div class="truncate max-w-full">
      {{ projectType.name }}
    </div>

    <div
      v-if="packageProposalCount"
      v-tooltip="'Proposed packages'"
      class="absolute top-0 left-0 pt-1 pl-1"
    >
      <div class="text-xs text-gray-500 bg-gray-700 px-1 rounded">
        {{ packageProposalCount }}
      </div>
    </div>
  </div>
</template>
