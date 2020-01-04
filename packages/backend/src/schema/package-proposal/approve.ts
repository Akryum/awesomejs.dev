import gql from 'graphql-tag'
import { query as q, Expr, values } from 'faunadb'
import { indexPackage } from '@/util/package-index'
import { Resolvers } from '@/generated/schema'
import { mapDocument } from '@/util/fauna'
import { checkPackageTeamAccess } from '../team/team-access'

export const typeDefs = gql`
extend type Mutation {
  approvePackageProposal (input: ApprovePackageProposalInput!): Package @auth
}

input ApprovePackageProposalInput {
  proposalId: ID!
}
`

export const resolvers: Resolvers = {
  Mutation: {
    approvePackageProposal: async (root, { input }, ctx) => {
      const ref = q.Ref(q.Collection('PackageProposals'), input.proposalId)
      await checkPackageTeamAccess(ctx, ref)

      const pkgProposal: any = await ctx.db.query(
        q.Get(ref),
      )

      // Update tag maps
      const projectTypes = await ctx.db.query<Array<values.Document<any>>>(q.Map(
        pkgProposal.data.projectTypes,
        q.Lambda(['ref'], q.Get(q.Var('ref'))),
      ))
      const projectTypeUpdates: Expr[] = []
      for (const projectType of projectTypes) {
        const tagMap = projectType.data.tagMap
        for (const tag of pkgProposal.data.info.tags) {
          tagMap[tag] = tagMap[tag] || 0
          tagMap[tag]++
        }
        projectTypeUpdates.push(q.Update(
          projectType.ref,
          {
            data: {
              tagMap,
            },
          },
        ))
      }

      const pkg: any = await ctx.db.query(
        q.Do(
          q.Delete(pkgProposal.ref),
          ...projectTypeUpdates,
          q.Create(
            q.Collection('Packages'),
            {
              data: {
                name: pkgProposal.data.name,
                projectTypes: projectTypes.map((pt) => pt.ref),
                info: pkgProposal.data.info,
                dataSources: pkgProposal.data.dataSources,
                metadata: pkgProposal.data.metadata,
              },
            },
          ),
        ),
      )

      await indexPackage(ctx, pkg)

      return mapDocument(pkg)
    },
  },
}
