import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'
import { query as q, values } from 'faunadb'
import { editPackageProjectTypes } from '../package-interface/edit-project-types'
import { updatePackageIndex } from '@/util/package-index'
import { updateProjectTypeTags } from '@/util/tag-map'
import { mapDocument } from '@/util/fauna'
import { checkPackageTeamAccess } from '../team/team-access'

export const typeDefs = gql`
extend type Mutation {
  editPackageProjectTypes (input: EditPackageProjectTypesInput!): Package @auth
}
`

export const resolvers: Resolvers = {
  Mutation: {
    editPackageProjectTypes: async (root, { input }, ctx) => {
      const ref = q.Ref(q.Collection('Packages'), input.packageId)
      await checkPackageTeamAccess(ctx, ref)

      const oldDoc = await ctx.db.query<values.Document<any>>(q.Get(ref))

      const doc = await editPackageProjectTypes(ref, input.projectTypeIds, ctx)

      // Update tags
      // Dedupe project type refs
      const projectTypeIds = Array.from(new Set([
        ...oldDoc.data.projectTypes.map((r: values.Ref) => r.id),
        ...doc.data.projectTypes.map((r: values.Ref) => r.id),
      ]))
      const projectTypeRefs = projectTypeIds.map((id) => q.Ref(q.Collection('ProjectTypes'), id))
      for (const projectTypeRef of projectTypeRefs) {
        await updateProjectTypeTags(projectTypeRef, ctx)
      }

      // Update index
      await updatePackageIndex(ctx, doc)

      return mapDocument(doc)
    },
  },
}
