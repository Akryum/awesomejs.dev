import { SchemaDirectiveVisitor } from 'graphql-tools'
import { defaultFieldResolver, GraphQLField } from 'graphql'
import { gql } from 'apollo-server-core'
import { ErrorCode } from '@/const/error-codes'
import { query as q } from 'faunadb'
import { getIndexObject, indexPackage } from '../util/package-index'
import { Resolvers } from '@/generated/schema'
import { ApolloError } from '@nodepack/plugin-apollo'

export const typeDefs = gql`
"""
Field requiring authenticated user.
Otherwise, a 'unauthorized' error is thrown.
"""
directive @admin on FIELD_DEFINITION

extend type Mutation {
  indexPackages: Boolean @admin @auth
  indexPackage (id: ID!): Boolean @admin @auth
  resetProjectTypeTagCounters: Boolean @admin @auth
}
`

export const schemaDirectives = {
  admin: class AuthDirective extends SchemaDirectiveVisitor {
    public visitFieldDefinition (field: GraphQLField<any, any>) {
      const { resolve = defaultFieldResolver } = field
      field.resolve = (root, args, context, info) => {
        if (!context.user.admin) { throw new ApolloError('Access denied', ErrorCode.ERROR_UNAUTHORIZED) }
        return resolve(root, args, context, info)
      }
    }
  },
}

export const resolvers: Resolvers = {
  Mutation: {
    // Used to index all packages by admin
    indexPackages: async (root, args, ctx) => {
      const { data: allPackages } = await ctx.db.query(
        q.Map(
          q.Map(
            q.Paginate(q.Match(q.Index('all_packages')), { size: 100000 }),
            q.Lambda('ref', q.Get(q.Var('ref'))),
          ),
          q.Lambda('doc',
            q.Merge(
              q.Var('doc'),
              {
                projectType: q.Get(q.Ref(
                  q.Collection('ProjectTypes'),
                  q.Select(['data', 'projectTypeId'], q.Var('doc')),
                )),
              },
            ),
          ),
        ),
      )

      const index = ctx.algolia.initIndex('packages')
      await index.addObjects(
        await Promise.all(allPackages.map((doc: any) => getIndexObject(
          ctx,
          doc,
        ))),
      )
      return true
    },

    indexPackage: async (root, { id }, ctx) => {
      const pkg: any = await ctx.db.query(
        q.Let({
          doc: q.Get(q.Ref(
            q.Collection('Packages'),
            id,
          )),
        },
        q.Merge(
          q.Var('doc'),
          {
            projectType: q.Get(q.Ref(
              q.Collection('ProjectTypes'),
              q.Select(['data', 'projectTypeId'], q.Var('doc')),
            )),
          },
        )),
      )
      await indexPackage(ctx, pkg)
      return true
    },

    resetProjectTypeTagCounters: async (root, args, ctx) => {
      const projectTypeMap = new Map<string, Map<string, number>>()
      const { data: packages } = await ctx.db.query(q.Map(
        q.Paginate(q.Match(q.Index('all_packages')), { size: 100000 }),
        q.Lambda('ref', q.Get(q.Var('ref'))),
      ))
      for (const pkg of packages) {
        let counters = projectTypeMap.get(pkg.data.projectTypeId)
        if (!counters) {
          counters = new Map<string, number>()
          projectTypeMap.set(pkg.data.projectTypeId, counters)
        }
        for (const tag of pkg.data.info.tags) {
          let count = counters.get(tag)
          if (!count) {
            count = 0
          }
          count++
          counters.set(tag, count)
        }
      }
      await ctx.db.query(
        q.Do(
          // Reset counters to empty objects
          q.Foreach(
            q.Paginate(q.Match(q.Index('all_projecttypes')), { size: 100000 }),
            q.Lambda('ref', q.Do(
              q.Update(q.Var('ref'), { data: { tagMap: null } }),
              q.Update(q.Var('ref'), { data: { tagMap: {} } }),
            )),
          ),
          // Set counts
          ...Array.from(projectTypeMap.keys()).map((id) =>
            q.Update(
              q.Ref(q.Collection('ProjectTypes'), id),
              {
                data: {
                  tagMap: Array.from(projectTypeMap.get(id).keys()).reduce((map, key) => {
                    map[key] = projectTypeMap.get(id).get(key)
                    return map
                  }, {} as { [key: string]: number }),
                },
              },
            ),
          ),
        ),
      )
      return true
    },
  },
}
