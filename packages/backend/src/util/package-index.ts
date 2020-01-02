import { Context } from '@/context'
import { query as q } from 'faunadb'

export async function getIndexObject (
  ctx: Context,
  pkg: any,
) {
  const npmData = await ctx.npm(`/${encodeURIComponent(pkg.data.name)}`)
  let githubData
  if (pkg.data.metadata.github) {
    const { owner, repo } = pkg.data.metadata.github.data.slug
    const { data } = await ctx.github.repos.get({
      owner,
      repo,
    })
    githubData = data
  } else {
    githubData = {
      owner: {},
    }
  }
  const projectType = await ctx.db.query<any>(q.Get(pkg.data.projectTypes[0]))
  const projectTypes = await ctx.db.query<any[]>(q.Map(
    pkg.data.projectTypes,
    q.Lambda(['ref'], q.Get(q.Var('ref'))),
  ))
  return {
    objectID: pkg.ref.id,
    _tags: pkg.data.info.tags || [],
    name: pkg.data.name,
    description: githubData.description || npmData.description,
    keywords: npmData.keywords,
    license: npmData.license,
    maintainers: npmData.maintainers,
    stars: githubData.stargazers_count || 0,
    defaultLogo: githubData.owner.avatar_url,
    projectType: {
      id: projectType.ref.id,
      name: projectType.data.name,
      slug: projectType.data.slug,
      logo: projectType.data.logo,
    },
    projectTypes: projectTypes.map((pt) => ({
      id: pt.ref.id,
      name: pt.data.name,
      slug: pt.data.slug,
      logo: pt.data.logo,
    })),
  }
}

export async function indexPackage (
  ctx: Context,
  pkg: any,
) {
  const index = ctx.algolia.initIndex('packages')
  return index.addObject(await getIndexObject(ctx, pkg))
}

export async function updatePackageIndex (
  ctx: Context,
  pkg: any,
) {
  const index = ctx.algolia.initIndex('packages')
  return index.saveObject(await getIndexObject(ctx, pkg))
}
