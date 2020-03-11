import { Resolvers } from '@/generated/schema'
import { getNpmMetadata, getGithubMetadata } from '@/util/metadata'
import { getReadme } from '@/util/readme'
import gql from 'graphql-tag'

export const typeDefs = gql`
extend interface PackageInterface {
  stars: Int
  repo: String
  defaultLogo: String
  maintainers: [PackageMaintainer!]!
  homepage: String
  license: String
  description: String
  readme: String
}

extend type Package {
  stars: Int
  repo: String
  defaultLogo: String
  maintainers: [PackageMaintainer!]!
  homepage: String
  license: String
  description: String
  readme: String
}

extend type PackageProposal {
  stars: Int
  repo: String
  defaultLogo: String
  maintainers: [PackageMaintainer!]!
  homepage: String
  license: String
  description: String
  readme: String
}
`

export const resolvers: Resolvers = {
  PackageInterface: {
    stars: async (pkg, args, ctx) => (await getGithubMetadata(pkg, ctx)).stars,
    repo: async (pkg, args, ctx) => (await getGithubMetadata(pkg, ctx)).htmlUrl,
    defaultLogo: async (pkg, args, ctx) => {
      if (pkg.dataSources.npm) {
        const data = await getNpmMetadata(pkg, ctx)
        if (data?.logo) {
          return data.logo
        } else if (data?.awesomejs?.logo) {
          return data.awesomejs.logo
        }
      }
      return (await getGithubMetadata(pkg, ctx)).owner?.avatar
    },
    maintainers: async (pkg, args, ctx) => (await getNpmMetadata(pkg, ctx)).maintainers || [],
    homepage: async (pkg, args, ctx) => (await getNpmMetadata(pkg, ctx)).homepage,
    license: async (pkg, args, ctx) => (await getNpmMetadata(pkg, ctx)).license,
    description: async (pkg, args, ctx) => (await getGithubMetadata(pkg, ctx)).description ||
      (await getNpmMetadata(pkg, ctx)).description,
    readme: async (pkg, args, ctx) => getReadme(pkg, ctx),
  },
}
