import gql from 'graphql-tag'
import { query as q, values, Expr } from 'faunadb'
import { Resolvers } from '@/generated/schema'

export const typeDefs = gql`
extend type ProjectType {
  packages (tags: [String!] = null, after: JSON = null): PackagesPage!
}

type PackagesPage {
  items: [Package!]!
  after: JSON
}

extend type Query {
  package (id: ID!): Package
  packageByName (name: String!): Package
}
`

export const resolvers: Resolvers = {
  ProjectType: {
    packages: async (projectType, input, ctx) => {
      const { data, after } = await ctx.db.query(
        q.Map(
          q.Paginate(
            input.tags && input.tags.length
              ? q.Join(
                q.Intersection(
                  q.Match(q.Index('packages_projecttypeid'), projectType.id),
                  q.Union(
                    ...input.tags.map((tag: string) => q.Match(q.Index('packages_by_tag'), tag)),
                  ),
                ),
                q.Index('packages_by_ref_sort_by_stars_desc'),
              )
              : q.Match(q.Index('packages_sort_by_stars_desc'), projectType.id),
            { size: 12, after: input.after ? new Expr(input.after) : null },
          ),
          q.Lambda(['stars', 'ref'], q.Get(q.Var('ref'))),
        ),
      )
      return {
        items: data.map((doc: values.Document) => ({
          id: doc.ref.id,
          collection: doc.ref.collection.id,
          ...doc.data,
        })),
        after,
      }
    },
  },

  Query: {
    package: async (root, { id }, ctx) => {
      const { ref, data } = await ctx.db.query(
        q.Get(q.Ref(q.Collection('Packages'), id)),
      )
      if (data) {
        return {
          id,
          collection: ref.collection.id,
          ...data,
        }
      }
    },

    packageByName: async (root, { name } , ctx) => {
      try {
        const { ref: { id, collection }, data } = await ctx.db.query(
          q.Get(q.Match(q.Index('packages_by_name'), name)),
        )
        return {
          id,
          collection: collection.id,
          ...data,
        }
      } catch (e) {
        // Nothing
      }
    },
  },
}
