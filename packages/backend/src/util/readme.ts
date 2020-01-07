import { Context } from '@/context'
import { getNpmMetadata, getGithubMetadata } from './metadata'
import { GithubDataSource } from '@/schema/package-interface/data-source'

export async function getFileContent (
  githubDatasource: GithubDataSource,
  path: string,
  ctx: Context,
) {
  const { data }: { data: string } = await ctx.github.repos.getContents({
    owner: githubDatasource.owner,
    repo: githubDatasource.repo,
    headers: {
      accept: 'application/vnd.github.3.html',
    },
    path,
  }) as any
  return data
}

export async function getReadmeContent (
  githubDatasource: GithubDataSource,
  ctx: Context,
) {
  const { data }: { data: string } = await ctx.github.repos.getReadme({
    owner: githubDatasource.owner,
    repo: githubDatasource.repo,
    headers: {
      accept: 'application/vnd.github.3.html',
    },
  }) as any
  return data
}

export async function getReadme (
  pkg: any,
  ctx: Context,
): Promise<string> {
  if (pkg.dataSources.github) {
    const npmMetadata = pkg.dataSources.npm ? await getNpmMetadata(pkg, ctx) : null
    let data: string
    if (npmMetadata?.repository?.directory) {
      data = await getFileContent(pkg.dataSources.github, `${npmMetadata.repository.directory}/README.md`, ctx)
    }
    if (!data) {
      data = await getReadmeContent(pkg.dataSources.github, ctx)
    }
    const githubMetadata = await getGithubMetadata(pkg, ctx)
    data = processReadme(pkg.dataSources.github, data, githubMetadata.defaultBranch)
    return data
  }
}

export function processReadme (
  githubDatasource: GithubDataSource,
  text: string,
  defaultBranch: string,
) {
  // Fix image urls
  text = text.replace(/src="([^"]+)/gi, (result, group1) => {
    if (group1.startsWith('http')) {
      return result
    } else if (group1.startsWith('/')) {
      return `src="https://github.com/${
        encodeURIComponent(githubDatasource.owner)
      }/${
        encodeURIComponent(githubDatasource.repo)
      }/raw/${defaultBranch}${group1}`
    } else {
      return `src="https://raw.githubusercontent.com/${
        encodeURIComponent(githubDatasource.owner)
      }/${
        encodeURIComponent(githubDatasource.repo)
      }/${defaultBranch}/${group1}${group1.endsWith('svg') ? '?sanitize=true' : ''}`
    }
  })

  // Fix image sizes
  text = text.replace(/(width|height)="(\d+)"/gi, (result, group1, group2) => `${result} style="${group1}:${group2}px"`)

  // Links
  text = text.replace(/href="(.*)"/gi, (result, group1) => {
    if (group1.startsWith('#')) {
      return `href="#user-content-${group1.substr(1)}"`
    } else {
      return `${result} target="_blank"`
    }
  })

  return text
}
