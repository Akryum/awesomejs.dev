<script>
import gql from 'graphql-tag'
import { pkgProposalFragment, pkgFragment } from './fragments'
import { useMutation } from '@vue/apollo-composable'

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

    proposals: {
      type: Array,
      required: true,
    },
  },

  setup (props, { root }) {
    const { mutate } = useMutation(gql`
      mutation ApprovePackageProposal ($input: ApprovePackageProposalInput!) {
        approvePackageProposal (input: $input) {
          ...pkg
        }
      }
      ${pkgFragment}
    `, () => ({
      variables: {
        input: {
          proposalId: props.proposal.id,
        },
      },
      update: (cache) => {
        const query = {
          query: gql`
              query ProjectTypePackages ($id: ID!) {
                projectType (id: $id) {
                  id
                  packageProposals {
                    ...pkgProposal
                  }
                }
              }
              ${pkgProposalFragment}
            `,
          variables: {
            id: props.projectTypeId,
          },
        }
        const data = cache.readQuery(query)
        const list = data.projectType.packageProposals
        list.splice(list.findIndex(p => p.id === props.proposal.id), 1)
        cache.writeQuery({
          ...query,
          data,
        })
      },
      optimisticResponse: {
        __typename: 'Mutation',
        approvePackageProposal: {
          __typename: 'Package',
          ...props.proposal,
        },
      },
    }))

    async function approve () {
      // Select next proposal
      let index = props.proposals.indexOf(props.proposal)
      if (index === props.proposals.length - 1) {
        index = 0
      } else {
        index++
      }
      const nextProposal = props.proposals[index]
      if (nextProposal) {
        root.$router.push({
          name: 'package-proposal',
          params: { packageId: nextProposal.id },
        })
      }

      // Approve mutation
      await mutate()
    }

    return {
      approve,
    }
  },
}
</script>

<template>
  <BaseButton
    class="bg-red-800 hover:bg-red-700 p-2 ml-4"
    @click="approve()"
  >
    Approve
  </BaseButton>
</template>
