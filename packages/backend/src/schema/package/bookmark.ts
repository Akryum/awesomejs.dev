import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'
import { query as q, values } from 'faunadb'
import { mapDocument, mapDocuments } from '@/util/fauna'

export const typeDefs = gql`
extend type Package {
  bookmarked: Boolean
}

extend type User {
  bookmarkedPackages: [Package!]!
}

type Mutation {
  togglePackageBookmark (input: TogglePackageBookmarkInput!): Package @auth
}

input TogglePackageBookmarkInput {
  packageId: ID!
}
`

export const resolvers: Resolvers = {
  Package: {
    bookmarked: async (pkg, args, ctx) => {
      if (!ctx.user) { return false }
      return !!await ctx.db.query(
        q.Exists(q.Match(
          q.Index('packagebookmarks_by_package_and_user'),
          q.Ref(q.Collection('Users'), ctx.user.id),
          q.Ref(q.Collection('Packages'), pkg.id),
        )),
      )
    },
  },

  User: {
    bookmarkedPackages: async (user, args, ctx) => {
      const { data } = await ctx.db.query(
        q.Map(
          q.Paginate(q.Match(q.Index('packagebookmarks_by_userref'), q.Ref(q.Collection('Users'), user.id))),
          q.Lambda(['ref'], q.Get(q.Select(['data', 'packageRef'], q.Get(q.Var('ref'))))),
        ),
      )
      return mapDocuments(data)
    },
  },

  Mutation: {
    togglePackageBookmark: async (root, { input }, ctx) => {
      const ref = q.Ref(q.Collection('Packages'), input.packageId)
      const userRef = q.Ref(q.Collection('Users'), ctx.user.id)
      const pkg: values.Document<any> = await ctx.db.query(
        q.Get(ref),
      )
      const match = q.Match(
        q.Index('packagebookmarks_by_package_and_user'),
        userRef,
        ref,
      )
      if (await ctx.db.query(q.Exists(match))) {
        await ctx.db.query(
          q.Delete(q.Select(['ref'], q.Get(match))),
        )
      } else {
        await ctx.db.query(
          q.Create(
            q.Collection('PackageBookmarks'),
            {
              data: {
                packageRef: pkg.ref,
                userRef,
              },
            },
          ),
        )
      }
      return mapDocument(pkg)
    },
  },
}
