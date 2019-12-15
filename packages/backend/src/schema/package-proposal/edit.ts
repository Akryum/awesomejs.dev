import gql from 'graphql-tag'
import { sanitizeTags } from '@/util/tags'
import { query as q } from 'faunadb'
import { Resolvers } from '@/generated/schema'

export const typeDefs = gql`
extend type Mutation {
  editPackageProposalInfo (input: EditPackageProposalInfoInput!): PackageProposal @admin @auth
}

input EditPackageProposalInfoInput {
  proposalId: ID!
  info: PackageInfoInput!
  github: GithubDataSourceInput
}
`

export const resolvers: Resolvers = {
  Mutation: {
    editPackageProposalInfo: async (root, { input }, ctx) => {
      input.info.tags = sanitizeTags(input.info.tags)

      const ref = q.Ref(q.Collection('PackageProposals'), input.proposalId)
      const { data } = await ctx.db.query(
        q.Do(
          q.Update(ref, {
            data: {
              info: input.info,
              dataSources: {
                github: input.github,
              },
              metadata: {
                github: null,
              },
            },
          }),
          q.Get(ref),
        ),
      )
      return {
        id: input.proposalId,
        ...data,
      }
    },
  },
}
