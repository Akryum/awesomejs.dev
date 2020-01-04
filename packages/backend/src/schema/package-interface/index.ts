import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'
import { query as q, values } from 'faunadb'
import { DBProjectType } from '../project-type/db-types'

export const typeDefs = gql`
interface PackageInterface {
  id: ID!
  name: String!
  projectTypes: [ProjectType!]!
  info: PackageInfo!
}

type Package implements PackageInterface {
  id: ID!
  name: String!
  projectTypes: [ProjectType!]!
  info: PackageInfo!
}

type PackageProposal implements PackageInterface {
  id: ID!
  name: String!
  projectTypes: [ProjectType!]!
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

input PackageInfoInput {
  tags: [String!]!
}
`

export const resolvers: Resolvers = {
  PackageInterface: {
    __resolveType: (pkg: any) => {
      if (pkg.ref.collection.id === 'Packages') { return 'Package' }
      if (pkg.ref.collection.id === 'PackageProposals') { return 'PackageProposal' }
      return null
    },

    projectTypes: async (pkg, input, ctx) => {
      const list = await ctx.db.query<any[]>(
        q.Map(
          pkg.projectTypes,
          q.Lambda(['ref'], q.Get(q.Var('ref'))),
        ),
      )
      return list.map((doc: values.Document) => ({
        id: doc.ref.id,
        ...doc.data,
      }) as DBProjectType)
    },
  },
}
