import { Context } from '@/context'

export async function getIndexObject (
  ctx: Context,
  pkg: any,
  projectType: any,
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
  }
}

export async function indexPackage (
  ctx: Context,
  pkg: any,
  projectType: any,
) {
  const index = ctx.algolia.initIndex('packages')
  return index.addObject(await getIndexObject(ctx, pkg, projectType))
}

export async function updatePackageIndex (
  ctx: Context,
  pkg: any,
  projectType: any,
) {
  const index = ctx.algolia.initIndex('packages')
  return index.saveObject(await getIndexObject(ctx, pkg, projectType))
}
