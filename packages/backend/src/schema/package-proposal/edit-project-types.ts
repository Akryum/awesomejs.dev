import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'
import { query as q } from 'faunadb'
import { editPackageProjectTypes } from '../package-interface/edit-project-types'

export const typeDefs = gql`
extend type Mutation {
  editPackageProposalProjectTypes (input: EditPackageProjectTypesInput!): PackageProposal
}
`

export const resolvers: Resolvers = {
  Mutation: {
    editPackageProposalProjectTypes: async (root, { input }, ctx) => {
      const ref = q.Ref(q.Collection('PackageProposals'), input.packageId)

      const doc = await editPackageProjectTypes(ref, input.projectTypeIds, ctx)
      return {
        id: doc.ref.id,
        ref: doc.ref,
        ...doc.data,
      }
    },
  },
}
