import gql from 'graphql-tag'
import { query as q } from 'faunadb'
import { Resolvers } from '@/generated/schema'

export const typeDefs = gql`
extend type PackageProposal {
  upvotes: Int!
  upvoted: Boolean!
}

extend type Mutation {
  togglePackageProposalUpvote (input: TogglePackageProposalUpvoteInput!): PackageProposal @auth
}

input TogglePackageProposalUpvoteInput {
  proposalId: ID!
}
`

export const resolvers: Resolvers = {
  PackageProposal: {
    upvoted: async (pkg, args, ctx) => {
      if (!ctx.user) { return false }
      return !!await ctx.db.query(
        q.Exists(q.Match(
          q.Index('packageproposalupvotes_by_proposal_and_user'),
          q.Ref(q.Collection('Users'), ctx.user.id),
          q.Ref(q.Collection('PackageProposals'), pkg.id),
        )),
      )
    },
  },

  Mutation: {
    togglePackageProposalUpvote: async (root, { input }, ctx) => {
      const ref = q.Ref(q.Collection('PackageProposals'), input.proposalId)
      const userRef = q.Ref(q.Collection('Users'), ctx.user.id)
      const match = q.Match(
        q.Index('packageproposalupvotes_by_proposal_and_user'),
        userRef,
        ref,
      )
      const { data } = await ctx.db.query(
        q.Get(ref),
      )
      if (await ctx.db.query(q.Exists(match))) {
        await ctx.db.query(
          q.Do(
            q.Delete(q.Select(['ref'], q.Get(match))),
            q.Update(ref, {
              data: {
                upvotes: --data.upvotes,
              },
            }),
          ),
        )
      } else {
        await ctx.db.query(
          q.Do(
            q.Create(
              q.Collection('PackageProposalUpvotes'),
              {
                data: {
                  proposalRef: ref,
                  userRef,
                },
              },
            ),
            q.Update(ref, {
              data: {
                upvotes: ++data.upvotes,
              },
            }),
          ),
        )
      }
      return {
        id: input.proposalId,
        ...data,
      }
    },
  },
}
