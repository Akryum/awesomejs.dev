import gql from 'graphql-tag'
import { IResolvers } from 'graphql-tools'
import { Context } from '@/context'
import { query as q } from 'faunadb'

export const typeDefs = gql`
type Package {
  id: ID!
  name: String!
  projectType: ProjectType!
  author: PackageAuthor!
  description: String
  stars: Int
}

type PackageAuthor {
  id: ID!
  name: String!
}

extend type Query {
  package (id: ID!): Package
}
`

export const resolvers: IResolvers<any, Context> = {
  Package: {
    author: async (pkg, args, ctx) => {
      const { ref: { id }, data } = await ctx.db.query(
        q.Get(q.Ref(q.Collection('PackageAuthors'), pkg.authorId)),
      )
      if (data) {
        return {
          id,
          ...data,
        }
      }
    },
  },

  Query: {
    package: async (root, { id }, ctx) => {
      const { data } = await ctx.db.query(
        q.Get(q.Ref(q.Collection('Packages'), id)),
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
