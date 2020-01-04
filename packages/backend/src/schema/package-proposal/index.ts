import gql from 'graphql-tag'
import { query as q, values } from 'faunadb'
import { Resolvers } from '@/generated/schema'

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
        const { ref, data } = await ctx.db.query(
          q.Get(proposal.userRef),
        )
        return {
          id: ref.id,
          ref,
          ...data,
        }
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
      return data.map((doc: values.Document) => ({
        id: doc.ref.id,
        ref: doc.ref,
        ...doc.data,
      }))
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
      const { ref, data } = await ctx.db.query(
        q.Get(q.Ref(q.Collection('PackageProposals'), id)),
      )
      return {
        id: ref.id,
        ref,
        ...data,
      }
    },

    packageProposalByName: async (root, { name }, ctx) => {
      try {
        const { ref, data } = await ctx.db.query(
          q.Get(q.Match(q.Index('packageproposal_by_name'), name)),
        )
        return {
          id: ref.id,
          ref,
          ...data,
        }
      } catch (e) {
        // Nothing
      }
    },
  },
}

