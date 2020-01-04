import { getGithubDataSource } from '@/util/metadata'
import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'
import { getPageTotalCount } from '@/util/github'

export const typeDefs = gql`
type PackageRelease {
  id: ID!
  date: Date
  title: String
  tagName: String
  description: String
  prerelease: Boolean
  assets: [PackageReleaseAsset!]!
}

type PackageReleaseAsset {
  name: String!
  downloadUrl: String!
  size: Int!
}

extend interface PackageInterface {
  releases: [PackageRelease!]!
  releaseCount: Int
  tagCount: Int
}

extend type Package {
  releases: [PackageRelease!]!
  releaseCount: Int
  tagCount: Int
}

extend type PackageProposal {
  releases: [PackageRelease!]!
  releaseCount: Int
  tagCount: Int
}
`

export const resolvers: Resolvers = {
  PackageInterface: {
    releases: async (pkg, args, ctx) => {
      const { owner, repo } = await getGithubDataSource(pkg, ctx)
      if (repo) {
        const { data } = await ctx.github.repos.listReleases({
          owner,
          repo,
          headers: {
            accept: 'application/vnd.github.3.html',
          },
        })
        return data.filter((i) => !i.draft).map((item) => ({
          id: item.id.toString(),
          date: item.published_at,
          title: item.name || item.tag_name,
          tagName: item.tag_name,
          // @ts-ignore
          description: item.body_html,
          prerelease: item.prerelease,
          assets: item.assets.map((asset) => ({
            name: asset.name,
            downloadUrl: asset.browser_download_url,
            size: asset.size,
          })),
        }))
      }

      return []
    },

    releaseCount: async (pkg, args, ctx) => {
      const { owner, repo } = await getGithubDataSource(pkg, ctx)
      if (repo) {
        const result = await ctx.github.repos.listReleases({
          owner,
          repo,
          per_page: 1,
        })
        return getPageTotalCount(result)
      }
    },

    tagCount: async (pkg, args, ctx) => {
      const { owner, repo } = await getGithubDataSource(pkg, ctx)
      if (repo) {
        const result = await ctx.github.repos.listTags({
          owner,
          repo,
          per_page: 1,
        })
        return getPageTotalCount(result)
      }
    },
  },
}
