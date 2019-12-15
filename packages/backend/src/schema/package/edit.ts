import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'
import { query as q } from 'faunadb'
import { sanitizeTags } from '@/util/tags'
import { updateProjectTypeTags } from '@/util/tag-map'
import { updatePackage } from '@/util/package-index'

export const typeDefs = gql`
extend type Mutation {
  editPackageInfo (input: EditPackageInfoInput!): Package @admin @auth
}

input EditPackageInfoInput {
  packageId: ID!
  info: PackageInfoInput!
  github: GitHubRepoInput
}
`

export const resolvers: Resolvers = {
  Mutation: {
    editPackageInfo: async (root, { input }, ctx) => {
      input.info.tags = sanitizeTags(input.info.tags)

      const ref = q.Ref(q.Collection('Packages'), input.packageId)
      const pkg: any = await ctx.db.query(
        q.Do(
          q.Update(ref, {
            data: {
              info: input.info,
              dataSources: {
                github: input.github,
              },
              metadata: {
                github: null,
              },
            },
          }),
          q.Get(ref),
        ),
      )

      await updateProjectTypeTags(pkg.data.projectTypeId, ctx)

      const projectType = await ctx.db.query(
        q.Get(q.Ref(q.Collection('ProjectTypes'), pkg.data.projectTypeId)),
      )
      await updatePackage(ctx, pkg, projectType)

      return {
        id: input.packageId,
        ...pkg.data,
      }
    },
  },
}
