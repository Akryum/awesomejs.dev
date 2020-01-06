import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'
import { query as q } from 'faunadb'
import { checkPackageTeamAccess } from '../team/team-access'

export const typeDefs = gql`
input RemovePackageProposalInput {
  id: ID!
}

extend type Mutation {
  removePackageProposal (input: RemovePackageProposalInput!): Boolean!
}
`

export const resolvers: Resolvers = {
  Mutation: {
    removePackageProposal: async (root, { input }, ctx) => {
      const ref = q.Ref(q.Collection('PackageProposals'), input.id)
      await checkPackageTeamAccess(ctx, ref)
      await ctx.db.query(q.Delete(ref))
      return true
    },
  },
}
