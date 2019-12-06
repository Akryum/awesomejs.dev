import gql from 'graphql-tag'
import { sanitizeTags } from '@/util/tags'
import { IResolvers } from 'graphql-tools'
import { Context } from '@/context'
import { query as q } from 'faunadb'

export const typeDefs = gql`
extend type Mutation {
  editPackageProposalInfo (input: EditPackageProposalInfoInput!): PackageProposal @admin @auth
}

input EditPackageProposalInfoInput {
  proposalId: ID!
  info: PackageInfoInput!
  github: GitHubRepoInput
}
`

export const resolvers: IResolvers<any, Context> = {
  Mutation: {
    editPackageProposalInfo: async (root, { input }, ctx) => {
      input.info.tags = sanitizeTags(input.info.tags)

      const ref = q.Ref(q.Collection('PackageProposals'), input.proposalId)
      const { data } = await ctx.db.query(
        q.Do(
          q.Update(ref, {
            data: {
              info: input.info,
              github: input.github,
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
