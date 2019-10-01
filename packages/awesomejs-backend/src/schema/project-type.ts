import gql from 'graphql-tag'
import { IResolvers } from 'graphql-tools'
import { Context } from '@/context'
import { query as q, values } from 'faunadb'

export const typeDefs = gql`
type ProjectType {
  id: ID!
  name: String!
  logo: String!
  packages: [Package!]!
}

extend type Query {
  projectTypes: [ProjectType!]!
  projectType (id: ID!): ProjectType
}
`

export const resolvers: IResolvers<any, Context> = {
  ProjectType: {
    packages: async (projectType, args, ctx) => {
      const { data } = await ctx.db.query(
        q.Map(
          q.Paginate(
            q.Match(q.Index('packages_projecttypeid'), projectType.id),
          ),
          q.Lambda('X', q.Get(q.Var('X'))),
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
            q.Match(q.Index('all_projecttypes')),
          ),
          q.Lambda('X', q.Get(q.Var('X'))),
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
  },
}
