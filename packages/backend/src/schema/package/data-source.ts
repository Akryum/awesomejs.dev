import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'

export const typeDefs = gql`
extend type Package {
  dataSources: [PackageDataSource!]!
}

type PackageDataSource {
  type: String!
  data: JSON
}

input GithubDataSourceInput {
  owner: String!
  repo: String!
}
`

export const resolvers: Resolvers = {
  Package: {
    dataSources: async (pkg) => {
      return Object.keys(pkg.dataSources || {}).map((key) => ({
        type: key,
        // @ts-ignore
        data: pkg.dataSources[key],
      }))
    },
  },
}
