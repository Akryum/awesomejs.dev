import gql from 'graphql-tag'
import { query as q, values } from 'faunadb'
import * as Metadata from '../../util/metadata'
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

extend type Query {
  package (id: ID!): Package
  packageByName (name: String!): Package
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
}
