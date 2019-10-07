import mem from 'p-memoize'
import ms from 'ms'
import { Context } from '@/context'
import { query as q } from 'faunadb'

const METADATA_MAX_AGE = ms('2h')

export async function updateMetadata (ctx: Context, id: string, collection: string, type: string, data: any, version: number) {
  const result = {
    version,
    ts: Date.now(),
    data,
  }
  await ctx.db.query(
    q.Update(
      q.Ref(q.Collection(collection), id),
      {
        data: {
          metadata: {
            [type]: result
          }
        }
      }
    )
  )
  return result
}

const NPM_METADATA_VERSION = 4

export const getNpmMetadata = (collection: string) => mem(async (pkg: any, ctx: Context): Promise<any> => {
  try {
    let result = pkg.metadata && pkg.metadata.npm
    if (!result || result.version !== NPM_METADATA_VERSION || Date.now() - result.ts > METADATA_MAX_AGE) {
      const data = await ctx.npm(`/${encodeURIComponent(pkg.name)}`)
      console.log('REQUEST npm', pkg.name)
      // Add new data props to be saved here
      // and increment NPM_METADATA_VERSION
      result = await updateMetadata(ctx, pkg.id, collection, 'npm', {
        maintainers: data.maintainers,
        repository: data.repository,
        homepage: data.homepage,
        license: data.license,
        description: data.description,
      }, NPM_METADATA_VERSION)
    }
    return result.data
  } catch (e) {
    console.error(e)
    return {
      maintainers: [],
    }
  }
}, {
  maxAge: ms('1s'),
  cacheKey: pkg => pkg.id,
})

const GITHUB_METADATA_VERSION = 5

export const getGithubMetadata = (collection: string) => mem(async (pkg: any, ctx: Context): Promise<any> => {
  try {
    let result = pkg.metadata && pkg.metadata.github
    if (!result || result.version !== GITHUB_METADATA_VERSION || Date.now() - result.ts > METADATA_MAX_AGE) {
      let data, owner, repo

      if (pkg.github) {
        owner = pkg.github.owner
        repo = pkg.github.repo
      } else {
        let npmData = await getNpmMetadata(collection)(pkg, ctx)
        let githubUrl

        if (npmData.repository && npmData.repository.type === 'git' && npmData.repository.url.includes('github.com')) {
          githubUrl = npmData.repository.url
        } else if (npmData.bugs && npmData.bugs.url.includes('github.com')) {
          githubUrl = npmData.bugs.url
        } else if (npmData.homepage && npmData.homepage.includes('github.com')) {
          githubUrl = npmData.homepage
        }

        if (githubUrl) {
          const [, o, r] = /github\.com\/([a-z0-9_-]+)\/([a-z0-9_-]+)/i.exec(githubUrl)
          owner = o
          repo = r
        } else {
          data = {
            slug: {},
            owner: {},
          }
        }
      }
      
      if (!data) {
        const { data: githubData } = await ctx.github.repos.get({
          owner,
          repo,
        })
        console.log('REQUEST github', pkg.name)
        // Add new data props to be saved here
        // and increment GITHUB_METADATA_VERSION
        data = {
          slug: {
            owner,
            repo,
          },
          stars: githubData.stargazers_count,
          htmlUrl: githubData.html_url,
          owner: {
            avatar: githubData.owner.avatar_url,
          },
          description: githubData.description,
        }
      }
      result = await updateMetadata(ctx, pkg.id, collection, 'github', data, GITHUB_METADATA_VERSION)
    }
    return result.data
  } catch (e) {
    console.error(e)
    return {
      slug: {},
      owner: {},
    }
  }
}, {
  maxAge: ms('1s'),
  cacheKey: pkg => pkg.id,
})
