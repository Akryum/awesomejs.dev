import gql from 'graphql-tag'
import { query as q } from 'faunadb'
import { Resolvers } from '@/generated/schema'
import { editPackageCommon } from '../package-interface/edit'
import { mapDocument } from '@/util/fauna'
import { checkPackageTeamAccess } from '../team/team-access'

export const typeDefs = gql`
extend type Mutation {
  editPackageProposalInfo (input: EditPackageProposalInfoInput!): PackageProposal @auth
}

input EditPackageProposalInfoInput {
  common: EditPackageInterfaceInput!
}
`

export const resolvers: Resolvers = {
  Mutation: {
    editPackageProposalInfo: async (root, { input }, ctx) => {
      const ref = q.Ref(q.Collection('PackageProposals'), input.common.id)
      await checkPackageTeamAccess(ctx, ref)
      const item = await editPackageCommon(ref, input.common, ctx)
      return mapDocument(item)
    },
  },
}
