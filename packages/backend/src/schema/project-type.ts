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
  packages: [Package!]!
}

extend type Query {
  projectTypes: [ProjectType!]!
  projectType (id: ID!): ProjectType
  projectTypeBySlug (slug: String!): ProjectType
}
`

export const resolvers: IResolvers<any, Context> = {
  ProjectType: {
    packages: async (projectType, args, ctx) => {
      const { data } = await ctx.db.query(
        q.Map(
          q.Paginate(
            q.Match(q.Index('packages_sort_by_stars_desc'), projectType.id),
          ),
          q.Lambda(['stars', 'ref'], q.Get(q.Var('ref'))),
        ),
      )
      return data.map((doc: values.Document) => ({
        id: doc.ref.id,
        ...doc.data,
      }))
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
