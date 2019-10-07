import gql from 'graphql-tag'
import { IResolvers } from 'graphql-tools'
import { Context } from '@/context'
import { query as q, values } from 'faunadb'
import * as Metadata from './metadata'

const getNpmMetadata = Metadata.getNpmMetadata('Packages')
const getGithubMetadata = Metadata.getGithubMetadata('Packages')

export const typeDefs = gql`
type Package {
  id: ID!
  name: String!
  projectType: ProjectType!
  maintainers: [PackageMaintainer!]!
  description: String
  stars: Int
  repo: String
  homepage: String
  license: String
  defaultLogo: String
  bookmarked: Boolean
  readme: String
  info: PackageInfo!
}

type PackageMaintainer {
  name: String
  email: String
  avatar: String
}

type PackageInfo {
  tags: [String!]!
}

extend type User {
  bookmarkedPackages: [Package!]!
}

extend type Query {
  package (id: ID!): Package
  packageByName (name: String!): Package
}

type Mutation {
  togglePackageBookmark (input: TogglePackageBookmarkInput!): Package @auth
}

input TogglePackageBookmarkInput {
  packageId: ID!
}
`

export const resolvers: IResolvers<any, Context> = {
  Package: {
    stars: async (pkg, args, ctx) => (await getGithubMetadata(pkg, ctx)).stars,
    repo: async (pkg, args, ctx) => (await getGithubMetadata(pkg, ctx)).htmlUrl,
    defaultLogo: async (pkg, args, ctx) => (await getGithubMetadata(pkg, ctx)).owner.avatar,
    maintainers: async (pkg, args, ctx) => (await getNpmMetadata(pkg, ctx)).maintainers,
    homepage: async (pkg, args, ctx) => (await getNpmMetadata(pkg, ctx)).homepage,
    license: async (pkg, args, ctx) => (await getNpmMetadata(pkg, ctx)).license,
    description: async (pkg, args, ctx) => (await getGithubMetadata(pkg, ctx)).description ||
      (await getNpmMetadata(pkg, ctx)).description,
    bookmarked: async (pkg, args, ctx) => {
      if (!ctx.user) return false
      return ctx.db.query(
        q.Exists(q.Match(
          q.Index('packagebookmarks_by_package_and_user'),
          q.Ref(q.Collection('Users'), ctx.user.id),
          q.Ref(q.Collection('Packages'), pkg.id)
        ))
      )
    },
    readme: async (pkg, args, ctx) => {
      const { slug } = await getGithubMetadata(pkg, ctx)
      if (slug) {
        const { data } = await ctx.github.repos.getReadme({
          owner: slug.owner,
          repo: slug.repo,
          headers: {
            accept: 'application/vnd.github.3.html'
          }
        })
        return data
      }
    }
  },

  User: {
    bookmarkedPackages: async (user, args, ctx) => {
      const { data } = await ctx.db.query(
        q.Map(
          q.Paginate(q.Match(q.Index('packagebookmarks_by_userref'), q.Ref(q.Collection('Users'), user.id))),
          q.Lambda(['ref'], q.Get(q.Select(['data', 'packageRef'], q.Get(q.Var('ref')))))
        )
      )
      return data.map((doc: values.Document) => ({
        id: doc.ref.id,
        ...doc.data,
      }))
    }
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

    packageByName: async (root, { name } , ctx) => {
      try {
        const { ref: { id }, data } = await ctx.db.query(
          q.Get(q.Match(q.Index('packages_by_name'), name))
        )
        return {
          id,
          ...data,
        }
      } catch (e) {}
    }
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
          q.Delete(q.Select(['ref'], q.Get(match)))
        )
      } else {
        await ctx.db.query(
          q.Create(
            q.Collection('PackageBookmarks'),
            {
              data: {
                packageRef: pkg.ref,
                userRef,
                projectTypeRef: q.Ref(q.Collection('ProjectTypes'), pkg.data.projectTypeId)
              }
            }
          )
        )
      }
      return {
        id: pkg.ref.id,
        ...pkg.data,
      }
    }
  }
}
