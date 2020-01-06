<script>
import gql from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
import { useSelectNextProposal, removeProposalFromCache } from '@/util/proposal'

export default {
  props: {
    projectTypeId: {
      type: String,
      required: true,
    },

    proposal: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    // Action
    const { mutate } = useMutation(gql`
      mutation RemovePackageProposal ($input: RemovePackageProposalInput!) {
        removePackageProposal (input: $input)
      }
    `, () => {
      // Save current proposal ID as it will change since we immediately select another proposal
      const currentProposalId = props.proposal.id
      return {
        variables: {
          input: {
            id: currentProposalId,
          },
        },
        update: (cache) => {
          removeProposalFromCache(cache, props.projectTypeId, currentProposalId)
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removePackageProposal: true,
        },
      }
    })

    const { selectNext } = useSelectNextProposal()

    async function remove () {
      await selectNext(props.projectTypeId, props.proposal.id)

      // Approve mutation
      await mutate()
    }

    return {
      remove,
    }
  },
}
</script>

<template>
  <BaseButton
    icon-left="delete_forever"
    class="bg-red-700 hover:bg-red-800"
    @click="remove()"
  >
    Delete
  </BaseButton>
</template>
