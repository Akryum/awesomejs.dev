import gql from 'graphql-tag'
import { query as q } from 'faunadb'
import { indexPackage } from '@/util/package-index'
import { Resolvers } from '@/generated/schema'

export const typeDefs = gql`
extend type Mutation {
  approvePackageProposal (input: ApprovePackageProposalInput!): Package @admin @auth
}

input ApprovePackageProposalInput {
  proposalId: ID!
}
`

export const resolvers: Resolvers = {
  Mutation: {
    approvePackageProposal: async (root, { input }, ctx) => {
      const pkgProposal: any = await ctx.db.query(
        q.Get(q.Ref(q.Collection('PackageProposals'), input.proposalId)),
      )
      const projectType: any = await ctx.db.query(
        q.Get(pkgProposal.data.projectTypeRef),
      )
      const tagMap = projectType.data.tagMap
      for (const tag of pkgProposal.data.info.tags) {
        tagMap[tag] = tagMap[tag] || 0
        tagMap[tag]++
      }
      const pkg: any = await ctx.db.query(
        q.Do(
          q.Delete(pkgProposal.ref),
          q.Update(
            projectType.ref,
            {
              data: {
                tagMap,
              },
            },
          ),
          q.Create(
            q.Collection('Packages'),
            {
              data: {
                name: pkgProposal.data.name,
                projectTypeId: projectType.ref.id,
                github: pkgProposal.data.github,
                info: pkgProposal.data.info,
                metadata: pkgProposal.data.metadata,
              },
            },
          ),
        ),
      )
      await indexPackage(ctx, pkg, projectType)
      return {
        id: pkg.ref.id,
        ref: pkg.ref,
        ...pkg.data,
      }
    },
  },
}
