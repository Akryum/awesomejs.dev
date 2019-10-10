export function processReadme (
  text: string,
  slug: { owner: string, repo: string },
  defaultBranch: string,
) {
  // Fix image urls
  text = text.replace(/src="([^"]+)/g, (result, group1) => {
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
      }/${defaultBranch}/${group1}?sanitize=true`
    }
  })

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
