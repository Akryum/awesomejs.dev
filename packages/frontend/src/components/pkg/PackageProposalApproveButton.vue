<template>
  <BaseButton
    class="bg-red-800 hover:bg-red-700 p-2 ml-4"
    @click="approve()"
  >
    Approve
  </BaseButton>
</template>

<script>
import gql from 'graphql-tag'
import { pkgProposal, pkg } from './fragments'

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

  methods: {
    async approve () {
      const item = this.proposal

      // Select next proposal
      let index = this.proposals.indexOf(item)
      if (index === this.proposals.length - 1) {
        index = 0
      } else {
        index++
      }
      const nextProposal = this.proposals[index]
      if (nextProposal) {
        this.$router.push({
          name: 'package-proposal',
          params: { packageId: nextProposal.id },
        })
      }

      // Approve mutation
      await this.$apollo.mutate({
        mutation: gql`
          mutation ApprovePackageProposal ($input: ApprovePackageProposalInput!) {
            approvePackageProposal (input: $input) {
              ...pkg
            }
          }
          ${pkg}
        `,
        variables: {
          input: {
            proposalId: item.id,
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
              ${pkgProposal}
            `,
            variables: {
              id: this.projectTypeId,
            },
          }
          const data = cache.readQuery(query)
          const list = data.projectType.packageProposals
          list.splice(list.findIndex(p => p.id === item.id), 1)
          cache.writeQuery({
            ...query,
            data,
          })
        },
        optimisticResponse: {
          __typename: 'Mutation',
          approvePackageProposal: {
            __typename: 'Package',
            ...item,
          },
        },
      })
    },
  },
}
</script>
