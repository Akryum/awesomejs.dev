import gql from 'graphql-tag'
import { query as q, values } from 'faunadb'
import * as Metadata from '../util/metadata'
import { getReadme } from '@/util/readme'
import { Resolvers } from '@/generated/schema'

const getNpmMetadata = Metadata.getNpmMetadata('Packages')
const getGithubMetadata = Metadata.getGithubMetadata('Packages', 'packages')

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

extend type ProjectType {
  packages (tags: [String!] = null): [Package!]!
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

input PackageInfoInput {
  tags: [String!]!
}

input GitHubRepoInput {
  owner: String!
  repo: String!
}
`

export const resolvers: Resolvers = {
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
      if (!ctx.user) { return false }
      return !!await ctx.db.query(
        q.Exists(q.Match(
          q.Index('packagebookmarks_by_package_and_user'),
          q.Ref(q.Collection('Users'), ctx.user.id),
          q.Ref(q.Collection('Packages'), pkg.id),
        )),
      )
    },
    readme: async (pkg, args, ctx) => getReadme(pkg, getGithubMetadata, ctx),
  },

  ProjectType: {
    packages: async (projectType, { tags }, ctx) => {
      const { data } = await ctx.db.query(
        q.Map(
          q.Paginate(
            tags && tags.length
              ? q.Join(
                q.Intersection(
                  q.Match(q.Index('packages_projecttypeid'), projectType.id),
                  q.Union(
                    ...tags.map((tag: string) => q.Match(q.Index('packages_by_tag'), tag)),
                  ),
                ),
                q.Index('packages_by_ref_sort_by_stars_desc'),
              )
              : q.Match(q.Index('packages_sort_by_stars_desc'), projectType.id),
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

  User: {
    bookmarkedPackages: async (user, args, ctx) => {
      const { data } = await ctx.db.query(
        q.Map(
          q.Paginate(q.Match(q.Index('packagebookmarks_by_userref'), q.Ref(q.Collection('Users'), user.id))),
          q.Lambda(['ref'], q.Get(q.Select(['data', 'packageRef'], q.Get(q.Var('ref'))))),
        ),
      )
      return data.map((doc: values.Document) => ({
        id: doc.ref.id,
        ...doc.data,
      }))
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

    packageByName: async (root, { name } , ctx) => {
      try {
        const { ref: { id }, data } = await ctx.db.query(
          q.Get(q.Match(q.Index('packages_by_name'), name)),
        )
        return {
          id,
          ...data,
        }
      } catch (e) {
        // Nothing
      }
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
                projectTypeRef: q.Ref(q.Collection('ProjectTypes'), pkg.data.projectTypeId),
              },
            },
          ),
        )
      }
      return {
        id: pkg.ref.id,
        ...pkg.data,
      }
    },
  },
}
