<script>
import gql from 'graphql-tag'
import { ref } from '@vue/composition-api'
import { useMutation } from '@vue/apollo-composable'
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
    const { isAdmin } = useCurrentUser()
    const isShow = ref(false)
    const currentProposalId = props.projectType.id

    // Action
    const { mutate: approveProject } = useMutation(gql`
      mutation ApproveProjectProposal ($input: ApproveProjectProposalInput!) {
        approveProjectProposal (input: $input) {
          id
          name
        }
      }
    `, () => ({
      variables: {
        input: {
          projectId: currentProposalId,
        },
      },
    }))

    const { mutate: removeProposal } = useMutation(gql`
      mutation RemoveProjectProposal ($input: RemoveProjectProposalInput!) {
        removeProjectProposal (input: $input)
      }
    `, () => ({
      variables: {
        input: {
          id: currentProposalId,
        },
      },
    })
    )

    async function approve () {
      // Approve mutation
      await approveProject()
    }

    async function reject () {
      await removeProposal()
    }

    return {
      isShow,

      isAdmin,

      approve,
      reject,
    }
  },
}
</script>

<template>
  <div v-if="!isShow">
    <div
      class="
      flex flex-col items-center justify-center p-2 bg-gray-800 rounded
      w-24 h-24 lg:w-32 lg:h-32 relative
      hover:bg-gray-700
      "
      :class="{
        'rounded-b-none': isAdmin,
        'text-orange-200 bg-orange-900 hover:bg-orange-800': !isAdmin && projectType.inTeam,
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
    </div>
    <BaseButton
      v-if="isAdmin"
      class="bg-purple-800 hover:bg-purple-700 p-2 w-1/2 rounded-t-none rounded-r-none"
      icon-left="thumb_up"
      @click="approve()"
    />
    <BaseButton
      v-if="isAdmin"
      icon-left="thumb_down"
      class="bg-red-800 hover:bg-red-700 p-2 w-1/2 rounded-t-none rounded-l-none"
      @click="reject()"
    />
  </div>
</template>
