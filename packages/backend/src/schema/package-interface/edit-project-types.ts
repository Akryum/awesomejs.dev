import gql from 'graphql-tag'
import { Context } from '@/context'
import { Expr, query as q, values } from 'faunadb'
import { ApolloError } from '@nodepack/plugin-apollo'

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
    throw new ApolloError('Select at least one project type', 'form-validation')
  }

  // Update data
  const item = await ctx.db.query<values.Document<any>>(
    q.Do(
      q.Update(ref, {
        data: {
          projectTypes: projectTypeIds.map((id) => q.Ref(q.Collection('ProjectTypes'), id)),
        },
      }),
      q.Get(ref),
    ),
  )
  return item
}
