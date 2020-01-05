import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'

export const typeDefs = gql`
extend interface PackageInterface {
  insight: PackageInsight!
}

extend type Package {
  insight: PackageInsight!
}

extend type PackageProposal {
  insight: PackageInsight!
}

type PackageInsight {
  npm: PackageNpmInsight
}

type PackageNpmInsight {
  downloads (range: PackageNpmInsightDownloadsRange!): Int!
  downloadsPoints (range: PackageNpmInsightDownloadsRange!): [DownloadsPoint!]!
}

type DownloadsPoint {
  downloads: Int!
  day: Date!
}

enum PackageNpmInsightDownloadsRange {
  day
  week
  month
}
`

export const resolvers: Resolvers = {
  PackageInterface: {
    insight: (pkg) => pkg as any,
  },

  PackageInsight: {
    npm: (pkg: any) => pkg.dataSources.npm ? pkg : null,
  },

  PackageNpmInsight: {
    downloads: async (pkg: any, { range }, ctx) => {
      const data = await ctx.npmApi(`/downloads/point/last-${range}/${encodeURIComponent(pkg.dataSources.npm.name)}`)
      return data.downloads
    },

    downloadsPoints: async (pkg: any, { range }, ctx) => {
      const data = await ctx.npmApi(`/downloads/range/last-${range}/${encodeURIComponent(pkg.dataSources.npm.name)}`)
      return data.downloads
    },
  },
}
