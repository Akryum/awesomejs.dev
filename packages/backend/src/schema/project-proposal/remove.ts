import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'
import { query as q } from 'faunadb'
import { checkPackageTeamAccess } from '../team/team-access'

export const typeDefs = gql`
input RemoveProjectProposalInput {
  id: ID!
}

extend type Mutation {
  removeProjectProposal (input: RemoveProjectProposalInput!): Boolean!
}
`

export const resolvers: Resolvers = {
  Mutation: {
    removeProjectProposal: async (root, { input }, ctx) => {
      const ref = q.Ref(q.Collection('ProjectProposals'), input.id)
      await checkPackageTeamAccess(ctx, ref)
      await ctx.db.query(q.Delete(ref))
      return true
    },
  },
}
