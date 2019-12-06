import { Context } from '@/context'
import { query as q } from 'faunadb'

export async function updateProjectTypeTags (projectTypeId: string, ctx: Context) {
  const projectTypeRef = q.Ref(q.Collection('ProjectTypes'), projectTypeId)
  const { data: packages } = await ctx.db.query(q.Map(
    q.Paginate(q.Match(q.Index('packages_projecttypeid'), projectTypeRef), { size: 100000 }),
    q.Lambda('ref', q.Get(q.Var('ref'))),
  ))
  const counters = new Map<string, number>()
  for (const pkg of packages) {
    for (const tag of pkg.data.info.tags) {
      let count = counters.get(tag)
      if (!count) {
        count = 0
      }
      count++
      counters.set(tag, count)
    }
  }
  await ctx.db.query(
    q.Do(
      // Reset counters to empty objects
      q.Update(projectTypeRef, { data: { tagMap: null } }),
      q.Update(projectTypeRef, { data: { tagMap: Array.from(counters.keys()).reduce((map, key) => {
        map[key] = counters.get(key)
        return map
      }, {} as { [key: string]: number }) } }),
    ),
  )
}
