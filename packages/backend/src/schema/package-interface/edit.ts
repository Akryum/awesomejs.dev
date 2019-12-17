import gql from 'graphql-tag'
import { Context } from '@/context'
import { sanitizeTags } from '@/util/tags'
import { query as q, Expr, values } from 'faunadb'
import { EditPackageInterfaceInput } from '@/generated/schema'

export const typeDefs = gql`
input EditPackageInterfaceInput {
  id: ID!
  info: PackageInfoInput!
  dataSources: DataSourcesInput!
}
`

export async function editPackageCommon (
  ref: Expr,
  input: EditPackageInterfaceInput,
  ctx: Context,
) {
  // Process tags
  input.info.tags = sanitizeTags(input.info.tags)

  // Update data
  const item = await ctx.db.query<values.Document<any>>(
    q.Do(
      q.Update(ref, {
        data: {
          info: input.info,
          dataSources: {
            github: input.dataSources.github,
            npm: input.dataSources.npm,
          },
          metadata: {
            npm: null,
            github: null,
          },
        },
      }),
      q.Get(ref),
    ),
  )
  return item
}
