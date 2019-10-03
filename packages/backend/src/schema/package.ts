import gql from 'graphql-tag'
import { IResolvers } from 'graphql-tools'
import { Context } from '@/context'
import { query as q, values } from 'faunadb'
import mem from 'p-memoize'
import ms from 'ms'

const METADATA_MAX_AGE = ms('2h')

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
}

type PackageMaintainer {
  name: String
  email: String
  avatar: String
}

extend type Query {
  package (id: ID!): Package
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
  },

  Mutation: {
    togglePackageBookmark: async (root, { input }, ctx) => {
      const pkg: values.Document<any> = await ctx.db.query(
        q.Get(q.Ref(q.Collection('Packages'), input.packageId)),
      )
      const match = q.Match(
        q.Index('packagebookmarks_by_package_and_user'),
        q.Ref(q.Collection('Users'), ctx.user.id),
        q.Ref(q.Collection('Packages'), input.packageId)
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
                userRef: q.Ref(q.Collection('Users'), ctx.user.id),
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

async function updateMetadata (ctx: Context, id: string, type: string, data: any, version: number) {
  const result = {
    version,
    ts: Date.now(),
    data,
  }
  await ctx.db.query(
    q.Update(
      q.Ref(q.Collection('Packages'), id),
      {
        data: {
          metadata: {
            [type]: result
          }
        }
      }
    )
  )
  return result
}

const NPM_METADATA_VERSION = 4

const getNpmMetadata = mem(async (pkg: any, ctx: Context): Promise<any> => {
  let result = pkg.metadata.npm
  if (!result || result.version !== NPM_METADATA_VERSION || Date.now() - result.ts > METADATA_MAX_AGE) {
    const data = await ctx.npm(`/${encodeURIComponent(pkg.name)}`)
    console.log('REQUEST npm', pkg.name)
    // Add new data props to be saved here
    // and increment NPM_METADATA_VERSION
    result = await updateMetadata(ctx, pkg.id, 'npm', {
      maintainers: data.maintainers,
      repository: data.repository,
      homepage: data.homepage,
      license: data.license,
      description: data.description,
    }, NPM_METADATA_VERSION)
  }
  return result.data
}, {
  maxAge: ms('1s'),
  cacheKey: pkg => pkg.id,
})

const GITHUB_METADATA_VERSION = 4

const getGithubMetadata = mem(async (pkg: any, ctx: Context): Promise<any> => {
  let result = pkg.metadata.github
  if (!result || result.version !== GITHUB_METADATA_VERSION || Date.now() - result.ts > METADATA_MAX_AGE) {
    let data, owner, repo

    if (pkg.github) {
      owner = pkg.github.owner
      repo = pkg.github.repo
    } else {
      let npmData = await getNpmMetadata(pkg, ctx)
      if (!npmData.repository || npmData.repository.type !== 'git' || !npmData.repository.url.includes('github.com')) {
        data = {}
      } else {
        const [, o, r] = /github\.com\/(.*)\/(.*)\.git/.exec(npmData.repository.url)
        owner = o
        repo = r
      }
    }
    
    if (!data) {
      const { data: githubData } = await ctx.github.repos.get({
        owner,
        repo,
      })
      console.log('REQUEST github', pkg.name)
      // Add new data props to be saved here
      // and increment GITHUB_METADATA_VERSION
      data = {
        stars: githubData.stargazers_count,
        htmlUrl: githubData.html_url,
        owner: {
          avatar: githubData.owner.avatar_url,
        },
        description: githubData.description,
      }
    }
    result = await updateMetadata(ctx, pkg.id, 'github', data, GITHUB_METADATA_VERSION)
  }
  return result.data
}, {
  maxAge: ms('1s'),
  cacheKey: pkg => pkg.id,
})
