import gql from 'graphql-tag'
import { IResolvers } from 'graphql-tools'
import { Context } from '@/context'
import { query as q } from 'faunadb'
import { indexPackage } from '@/util/package-index'

export const typeDefs = gql`
extend type Mutation {
  approvePackageProposal (input: ApprovePackageProposalInput!): Package @admin @auth
}

input ApprovePackageProposalInput {
  proposalId: ID!
}
`

export const resolvers: IResolvers<any, Context> = {
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
        ...pkg.data,
      }
    },
  },
}
