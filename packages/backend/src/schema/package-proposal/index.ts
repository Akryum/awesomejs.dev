import gql from 'graphql-tag'
import { query as q, values } from 'faunadb'
import { Resolvers } from '@/generated/schema'
import { mapDocument, mapDocuments } from '@/util/fauna'

export const typeDefs = gql`
extend type PackageProposal {
  user: User
}

extend type ProjectType {
  packageProposals: [PackageProposal!]!
  packageProposalCount: Int!
}

extend type Query {
  packageProposal (id: ID!): PackageProposal
  packageProposalByName (name: String!): PackageProposal
}
`
export const resolvers: Resolvers = {
  PackageProposal: {
    user: async (proposal, args, ctx) => {
      try {
        const user = await ctx.db.query<values.Document<any>>(
          q.Get(proposal.userRef),
        )
        return mapDocument(user)
      } catch (e) {
        // Nothing
      }
    },
  },

  ProjectType: {
    packageProposals: async (projectType, args, ctx) => {
      const { data } = await ctx.db.query(
        q.Map(
          q.Paginate(
            q.Match(
              q.Index('packageproposals_by_projecttypes_sort_by_upvote'),
              q.Ref(q.Collection('ProjectTypes'), projectType.id),
            ),
          ),
          q.Lambda(['upvotes', 'ref'], q.Get(q.Var('ref'))),
        ),
      )
      return mapDocuments(data)
    },

    packageProposalCount: async (projectType, args, ctx) => {
      const { data } = await ctx.db.query(
        q.Count(
          q.Paginate(
            q.Match(
              q.Index('packageproposals_by_projecttypes_sort_by_upvote'),
              q.Ref(q.Collection('ProjectTypes'), projectType.id),
            ),
          ),
        ),
      )
      return data[0]
    },
  },

  Query: {
    packageProposal: async (root, { id }, ctx) => {
      const doc = await ctx.db.query<values.Document<any>>(
        q.Get(q.Ref(q.Collection('PackageProposals'), id)),
      )
      return mapDocument(doc)
    },

    packageProposalByName: async (root, { name }, ctx) => {
      try {
        const doc = await ctx.db.query<values.Document<any>>(
          q.Get(q.Match(q.Index('packageproposal_by_name'), name)),
        )
        return mapDocument(doc)
      } catch (e) {
        // Nothing
      }
    },
  },
}

