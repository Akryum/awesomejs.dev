import gql from 'graphql-tag'
import { query as q } from 'faunadb'
import { indexPackage } from '@/util/package-index'
import { Resolvers } from '@/generated/schema'
import { mapDocument } from '@/util/fauna'

export const typeDefs = gql`
extend type Mutation {
  approveProjectProposal (input: ApproveProjectProposalInput!): ProjectType @auth
}

input ApproveProjectProposalInput {
  projectId: ID!
}
`

export const resolvers: Resolvers = {
  Mutation: {
    approveProjectProposal: async (root, { input }, ctx) => {
      const ref = q.Ref(q.Collection('ProjectProposal'), input.projectId)

      const projectProposal: any = await ctx.db.query(
        q.Get(ref),
      )

      const project: any = await ctx.db.query(
        q.Do(
          q.Delete(projectProposal.ref),
          q.Create(
            q.Collection('ProjectTypes'),
            {
              data: {
                name: projectProposal.data.name,
                logo: projectProposal.data.logo,
                slug: projectProposal.data.slug
              },
            },
          ),
        ),
      )

      await indexPackage(ctx, project)

      return mapDocument(project)
    },
  },
}
