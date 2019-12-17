import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'
import { query as q } from 'faunadb'
import { updateProjectTypeTags } from '@/util/tag-map'
import { updatePackageIndex } from '@/util/package-index'
import { editPackageCommon } from '../package-interface/edit'

export const typeDefs = gql`
extend type Mutation {
  editPackageInfo (input: EditPackageInfoInput!): Package @admin @auth
}

input EditPackageInfoInput {
  common: EditPackageInterfaceInput!
}
`

export const resolvers: Resolvers = {
  Mutation: {
    editPackageInfo: async (root, { input }, ctx) => {
      const ref = q.Ref(q.Collection('Packages'), input.common.id)
      const pkg = await editPackageCommon(ref, input.common, ctx)

      // Update tags
      await updateProjectTypeTags(pkg.data.projectTypeId, ctx)

      // Update search index
      const projectType = await ctx.db.query(
        q.Get(q.Ref(q.Collection('ProjectTypes'), pkg.data.projectTypeId)),
      )
      await updatePackageIndex(ctx, pkg, projectType)

      return {
        id: input.common.id,
        ref: pkg.ref,
        ...pkg.data,
      }
    },
  },
}
