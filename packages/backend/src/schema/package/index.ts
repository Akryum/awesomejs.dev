import gql from 'graphql-tag'
import { query as q, values, Expr } from 'faunadb'
import { Resolvers } from '@/generated/schema'
import { DBProjectType } from '../project-type/db-types'

export const typeDefs = gql`
extend type Package {
  projectTypes: [ProjectType!]!
}

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
  Package: {
    projectTypes: async (pkg, input, ctx) => {
      const list = await ctx.db.query<any[]>(
        q.Map(
          pkg.projectTypes,
          q.Lambda(['ref'], q.Get(q.Var('ref'))),
        ),
      )
      return list.map((doc: values.Document) => ({
        id: doc.ref.id,
        ...doc.data,
      }) as DBProjectType)
    },
  },

  ProjectType: {
    packages: async (projectType, input, ctx) => {
      const projectTypeRef = q.Ref(q.Collection('ProjectTypes'), projectType.id)
      const { data, after } = await ctx.db.query(
        q.Map(
          q.Paginate(
            input.tags && input.tags.length
              ? q.Join(
                q.Intersection(
                  q.Match(q.Index('packages_by_project_type'), projectTypeRef),
                  q.Union(
                    ...input.tags.map((tag: string) => q.Match(q.Index('packages_by_tag'), tag)),
                  ),
                ),
                q.Index('packages_by_ref_sort_by_stars_desc'),
              )
              : q.Match(q.Index('packages_by_project_type_sort_by_stars_desc'), projectTypeRef),
            { size: 12, after: input.after ? new Expr(input.after) : null },
          ),
          q.Lambda(['stars', 'ref'], q.Get(q.Var('ref'))),
        ),
      )
      return {
        items: data.map((doc: values.Document) => ({
          id: doc.ref.id,
          ref: doc.ref,
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
          id: ref.id,
          ref,
          ...data,
        }
      }
    },

    packageByName: async (root, { name } , ctx) => {
      try {
        const { ref, data } = await ctx.db.query(
          q.Get(q.Match(q.Index('packages_by_name'), name)),
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
