import gql from 'graphql-tag'
import { query as q, values } from 'faunadb'
import { Resolvers } from '@/generated/schema'
import { mapDocument, mapDocuments } from '@/util/fauna'

export const typeDefs = gql`
extend type Query {
  projectProposals: [ProjectType!]!
  projectProposalBySlug (slug: String!): ProjectType
}
`
export const resolvers: Resolvers = {
  Query: {
    projectProposals: async (root, args, ctx) => {
      const { data } = await ctx.db.query(
        q.Map(
          q.Paginate(
            q.Match(q.Index('projects_proposal')),
          ),
          q.Lambda(['ref'], q.Get(q.Var('ref'))),
        ),
      )
      return mapDocuments(data)
    },

    projectProposalBySlug: async (root, { slug }, ctx) => {
      try {
        const doc = await ctx.db.query<values.Document<any>>(
          q.Get(q.Match(q.Index('project_proposal_by_slug'), slug)),
        )
        return mapDocument(doc)
      } catch { /* Nothing */ }
    },
  },
}

