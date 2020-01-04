import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'
import { query as q } from 'faunadb'
import { editPackageProjectTypes } from '../package-interface/edit-project-types'
import { mapDocument } from '@/util/fauna'
import { checkPackageTeamAccess } from '../team/team-access'

export const typeDefs = gql`
extend type Mutation {
  editPackageProposalProjectTypes (input: EditPackageProjectTypesInput!): PackageProposal @auth
}
`

export const resolvers: Resolvers = {
  Mutation: {
    editPackageProposalProjectTypes: async (root, { input }, ctx) => {
      const ref = q.Ref(q.Collection('PackageProposals'), input.packageId)
      await checkPackageTeamAccess(ctx, ref)
      const doc = await editPackageProjectTypes(ref, input.projectTypeIds, ctx)
      return mapDocument(doc)
    },
  },
}
