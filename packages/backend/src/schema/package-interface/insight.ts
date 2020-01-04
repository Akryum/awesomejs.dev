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
  },
}
