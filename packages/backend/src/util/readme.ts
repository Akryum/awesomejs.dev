import { Context } from '@/context'

export async function getReadme (
  pkg: any,
  getGithubMetadata: ((pkg: any, ctx: Context) => Promise<any>),
  ctx: Context,
) {
  const { slug, defaultBranch } = await getGithubMetadata(pkg, ctx)
  if (slug) {
    let { data }: { data: string } = await ctx.github.repos.getReadme({
      owner: slug.owner,
      repo: slug.repo,
      headers: {
        accept: 'application/vnd.github.3.html',
      },
    }) as any
    data = processReadme(data, slug, defaultBranch)
    return data
  }
}

export function processReadme (
  text: string,
  slug: { owner: string, repo: string },
  defaultBranch: string,
) {
  // Fix image urls
  text = text.replace(/src="([^"]+)/gi, (result, group1) => {
    if (group1.startsWith('http')) {
      return result
    } else if (group1.startsWith('/')) {
      return `src="https://github.com/${
        encodeURIComponent(slug.owner)
      }/${
        encodeURIComponent(slug.repo)
      }/raw/${defaultBranch}${group1}`
    } else {
      return `src="https://raw.githubusercontent.com/${
        encodeURIComponent(slug.owner)
      }/${
        encodeURIComponent(slug.repo)
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
