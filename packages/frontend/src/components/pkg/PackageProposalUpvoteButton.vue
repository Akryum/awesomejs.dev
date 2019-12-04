<script>
import gql from 'graphql-tag'
import { useQuery, useResult, useMutation } from '@vue/apollo-composable'

export default {
  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    // Is Upvoted
    const { result, loading } = useQuery(gql`
      query PackageProposalUpvoted ($id: ID!) {
        packageProposal (id: $id) {
          id
          upvoted
        }
      }
    `, () => ({
      id: props.pkg.id,
    }))
    const upvoted = useResult(result, false, data => data.packageProposal.upvoted)

    // Toggle
    const { mutate: toggle } = useMutation(gql`
      mutation TogglePackageProposalUpvote ($input: TogglePackageProposalUpvoteInput!) {
        togglePackageProposalUpvote (input: $input) {
          id
          upvotes
          upvoted
        }
      }
    `, () => ({
      variables: {
        input: {
          proposalId: props.pkg.id,
        },
      },
      optimisticResponse: {
        __typename: 'Mutation',
        togglePackageProposalUpvote: {
          __typename: 'PackageProposal',
          id: props.pkg.id,
          upvoted: !upvoted.value,
          upvotes: upvoted.value ? props.pkg.upvotes - 1 : props.pkg.upvotes + 1,
        },
      },
    }))

    return {
      upvoted,
      loading,
      toggle,
    }
  },
}
</script>

<template>
  <BaseButton
    :disabled="loading"
    class="bg-gray-800 hover:bg-gray-700 px-8 py-4"
    :icon-left="upvoted ? 'check_box' : 'check_box_outline_blank'"
    @click="toggle()"
  >
    <b class="font-bold mr-1">{{ pkg.upvotes }}</b>
    upvote{{ pkg.upvotes > 1 ? 's' : '' }}
  </BaseButton>
</template>
