import mem from 'p-memoize'
import ms from 'ms'
import { Context } from '@/context'
import { query as q } from 'faunadb'

const METADATA_MAX_AGE = ms('6h')

export async function updateMetadata (
  ctx: Context,
  id: string,
  collection: string,
  type: string,
  data: any,
  version: number,
  additionalData: any = {},
) {
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
            [type]: result,
          },
          ...additionalData,
        },
      },
    ),
  )
  return result
}

const NPM_METADATA_VERSION = 4

export const getNpmMetadata = (collection: string) => mem(async (pkg: any, ctx: Context): Promise<any> => {
  try {
    if (pkg.dataSources?.npm !== 'error') {
      let result = pkg.metadata?.npm
      if (!result || result.version !== NPM_METADATA_VERSION || Date.now() - result.ts > METADATA_MAX_AGE) {
        let npmName: string

        if (pkg.dataSources?.npm) {
          npmName = pkg.dataSources.npm.name
        } else {
          npmName = pkg.name
        }

        const data = await ctx.npm(`/${encodeURIComponent(npmName)}`)
        console.log('REQUEST npm', npmName)
        // Add new data props to be saved here
        // and increment NPM_METADATA_VERSION
        result = await updateMetadata(ctx, pkg.id, collection, 'npm', {
          maintainers: data.maintainers,
          repository: data.repository,
          homepage: data.homepage,
          license: data.license,
          description: data.description,
        }, NPM_METADATA_VERSION, {
          dataSources: {
            npm: {
              name: npmName,
            },
          },
        })
      }
      return result.data
    }
  } catch (e) {
    console.error(e)
    await ctx.db.query(
      q.Update(
        q.Ref(q.Collection(collection), pkg.id),
        {
          data: {
            dataSources: {
              npm: 'error',
            },
          },
        },
      ),
    )
  }
  return {
    maintainers: [],
  }
}, {
  maxAge: ms('1s'),
  cacheKey: (pkg) => pkg.id,
})

const GITHUB_METADATA_VERSION = 6

export const getGithubDataSource = async (pkg: any, collection: string, ctx: Context) => {
  let owner: string
  let repo: string
  if (pkg.dataSources?.github) {
    owner = pkg.dataSources.github.owner
    repo = pkg.dataSources.github.repo
  } else if (pkg.github) {
    // @TODO legacy
    owner = pkg.github.owner
    repo = pkg.github.repo

    await ctx.db.query(
      q.Update(
        q.Ref(q.Collection(collection), pkg.id),
        {
          data: {
            github: null,
            dataSources: {
              github: {
                owner,
                repo,
              },
            },
          },
        },
      ),
    )

    console.log('Migrated from `github` to `dataSources.github`.')
  } else {
    const npmData = await getNpmMetadata(collection)(pkg, ctx)
    let githubUrl

    if (npmData.repository?.type === 'git' && npmData.repository?.url.includes('github.com')) {
      githubUrl = npmData.repository.url
    } else if (npmData.bugs?.url.includes('github.com')) {
      githubUrl = npmData.bugs.url
    } else if (npmData.homepage?.includes('github.com')) {
      githubUrl = npmData.homepage
    }

    if (githubUrl) {
      const [, o, r] = /github\.com\/([a-z0-9_-]+)\/([a-z0-9_-]+)/i.exec(githubUrl)
      owner = o
      repo = r

      await ctx.db.query(
        q.Update(
          q.Ref(q.Collection(collection), pkg.id),
          {
            data: {
              dataSources: {
                github: {
                  owner,
                  repo,
                },
              },
            },
          },
        ),
      )
    }
  }

  return {
    owner,
    repo,
  }
}

export const getGithubMetadata = (
  collection: string,
  updateAlgoliaIndex: string = null,
) => mem(async (pkg: any, ctx: Context): Promise<any> => {
  try {
    let result = pkg.metadata?.github
    if (!result || result.version !== GITHUB_METADATA_VERSION || Date.now() - result.ts > METADATA_MAX_AGE) {
      let data

      const { owner, repo } = await getGithubDataSource(pkg, collection, ctx)

      if (!repo) {
        return {}
      }

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
        defaultBranch: githubData.default_branch,
      }

      if (updateAlgoliaIndex) {
        const index = ctx.algolia.initIndex(updateAlgoliaIndex)
        await index.partialUpdateObject({
          objectID: pkg.id,
          stars: githubData.stargazers_count,
          defaultLogo: githubData.owner.avatar_url,
          ...(githubData.description ? {
            description: githubData.description,
          } : {}),
        })
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
  cacheKey: (pkg) => pkg.id,
})
