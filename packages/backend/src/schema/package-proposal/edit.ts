import gql from 'graphql-tag'
import { query as q } from 'faunadb'
import { Resolvers } from '@/generated/schema'
import { editPackageCommon } from '../package-interface/edit'

export const typeDefs = gql`
extend type Mutation {
  editPackageProposalInfo (input: EditPackageProposalInfoInput!): PackageProposal @admin @auth
}

input EditPackageProposalInfoInput {
  common: EditPackageInterfaceInput!
}
`

export const resolvers: Resolvers = {
  Mutation: {
    editPackageProposalInfo: async (root, { input }, ctx) => {
      const ref = q.Ref(q.Collection('PackageProposals'), input.common.id)
      const item = await editPackageCommon(ref, input.common, ctx)
      return {
        id: input.common.id,
        ref: item.data,
        ...item.data,
      }
    },
  },
}
