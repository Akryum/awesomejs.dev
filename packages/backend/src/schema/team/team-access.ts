import { User, Context } from '@/context'
import { query as q, values } from 'faunadb'
import { ApolloError } from '@nodepack/plugin-apollo'
import { ErrorCode } from '@/const/error-codes'

export async function loadTeams (
  user: User,
  ctx: Context,
) {
  if (!user.teamsProjectTypes) {
    const { data } = await ctx.db.query(q.Map(
      q.Paginate(q.Match(q.Index('teams_by_user'), user.ref), { size: 1000 }),
      q.Lambda(['ref'], q.Select(['data', 'projectTypes'], q.Get(q.Var('ref')))),
    ))
    const teamsProjectTypes = []
    for (const projectTypes of data) {
      teamsProjectTypes.push(...projectTypes)
    }
    user.teamsProjectTypes = teamsProjectTypes
  }
}

export async function hasTeamAccess (
  ctx: Context,
  projectTypeId: string,
  user: User = ctx.user,
): Promise<boolean> {
  if (!ctx.user) { return false }
  if (ctx.user.admin) { return true }

  await loadTeams(user, ctx)

  return user.teamsProjectTypes.some((ref) => ref.id === projectTypeId)
}

export async function checkTeamAccess (
  ctx: Context,
  projectTypeId: string,
  user: User = ctx.user,
) {
  if (!await hasTeamAccess(ctx, projectTypeId, user)) {
    throw new ApolloError('Unauthorized', ErrorCode.ERROR_UNAUTHORIZED)
  }
}

export async function hasPackageTeamAccess (
  ctx: Context,
  pkgRef: any,
  user: User = ctx.user,
) {
  if (!ctx.user) { return false }
  if (ctx.user.admin) { return true }

  const doc = await ctx.db.query<values.Document<any>>(q.Get(pkgRef))
  for (const ptRef of doc.data.projectTypes) {
    if (await hasTeamAccess(ctx, ptRef.id, user)) {
      return true
    }
  }
  return false
}

export async function checkPackageTeamAccess (
  ctx: Context,
  pkgRef: any,
  user: User = ctx.user,
) {
  if (!await hasPackageTeamAccess(ctx, pkgRef, user)) {
    throw new ApolloError('Unauthorized', ErrorCode.ERROR_UNAUTHORIZED)
  }
}
