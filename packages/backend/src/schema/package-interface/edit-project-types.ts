import gql from 'graphql-tag'
import { Context } from '@/context'
import { Expr, query as q, values } from 'faunadb'
import { ApolloError } from '@nodepack/plugin-apollo'
import { ErrorCode } from '@/const/error-codes'

export const typeDefs = gql`
input EditPackageProjectTypesInput {
  packageId: ID!
  projectTypeIds: [ID!]!
}
`

export async function editPackageProjectTypes (
  ref: Expr,
  projectTypeIds: string[],
  ctx: Context,
) {
  if (!projectTypeIds.length) {
    throw new ApolloError('Select at least one project type', ErrorCode.ERROR_VALIDATION)
  }

  // Update data
  const item = await ctx.db.query<values.Document<any>>(
    q.Update(ref, {
      data: {
        projectTypes: projectTypeIds.map((id) => q.Ref(q.Collection('ProjectTypes'), id)),
      },
    }),
  )
  return item
}
