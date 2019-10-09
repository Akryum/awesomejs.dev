import gql from 'graphql-tag'
import { IResolvers } from 'graphql-tools'
import { Context } from '@/context'
import { query as q, values } from 'faunadb'

export const typeDefs = gql`
type ProjectType {
  id: ID!
  name: String!
  slug: String!
  logo: String!
  popularTags: [String!]!
}

extend type Query {
  projectTypes: [ProjectType!]!
  projectType (id: ID!): ProjectType
  projectTypeBySlug (slug: String!): ProjectType
}
`

export const resolvers: IResolvers<any, Context> = {
  ProjectType: {
    popularTags: (projectType) => {
      return Object.keys(projectType.tagMap).filter(
        (key) => key !== projectType.name.toLowerCase(),
      ).sort(
        (a, b) => projectType.tagMap[b] - projectType.tagMap[a],
      ).slice(0, 8)
    },
  },

  Query: {
    projectTypes: async (root, args, ctx) => {
      const { data } = await ctx.db.query(
        q.Map(
          q.Paginate(
            q.Match(q.Index('projecttypes_sort_by_name_asc')),
          ),
          q.Lambda(['name', 'ref'], q.Get(q.Var('ref'))),
        ),
      )
      return data.map((doc: values.Document) => ({
        id: doc.ref.id,
        ...doc.data,
      }))
    },

    projectType: async (root, { id }, ctx) => {
      const { data } = await ctx.db.query(
        q.Get(q.Ref(q.Collection('ProjectTypes'), id)),
      )
      if (data) {
        return {
          id,
          ...data,
        }
      }
    },

    projectTypeBySlug: async (root, { slug }, ctx) => {
      const { ref: { id }, data } = await ctx.db.query(
        q.Get(q.Match(q.Index('projecttypes_by_slug'), slug)),
      )
      if (data) {
        return {
          id,
          ...data,
        }
      }
    },
  },
}
