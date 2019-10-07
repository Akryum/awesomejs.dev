<template>
  <BaseButton
    class="bg-gray-800 hover:bg-gray-700 px-8 py-4"
    :icon-left="upvoted ? 'check_box' : 'check_box_outline_blank'"
    @click="toggle()"
  >
    <b class="font-bold mr-1">{{ pkg.upvotes }}</b>
    upvote{{ pkg.upvotes > 1 ? 's' : '' }}
  </BaseButton>
</template>

<script>
import gql from 'graphql-tag'
import { checkUnauthorized } from '@/util/error'

export default {
  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  apollo: {
    upvoted: {
      query: gql`
        query PackageProposalUpvoted ($id: ID!) {
          packageProposal (id: $id) {
            id
            upvoted
          }
        }
      `,
      variables () {
        return {
          id: this.pkg.id,
        }
      },
      update: data => data.packageProposal.upvoted,
    },
  },

  methods: {
    async toggle () {
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation TogglePackageProposalUpvote ($input: TogglePackageProposalUpvoteInput!) {
              togglePackageProposalUpvote (input: $input) {
                id
                upvotes
                upvoted
              }
            }
          `,
          variables: {
            input: {
              packageId: this.packageId,
            },
          },
          optimisticResponse: {
            __typename: 'Mutation',
            togglePackageBookmark: {
              __typename: 'Package',
              id: this.packageId,
              bookmarked: !this.pkg.bookmarked,
            },
          },
        })
      } catch (e) {
        console.error(e)
        checkUnauthorized.bind(this)(e)
      }
    },
  },
}
</script>
