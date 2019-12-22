import Octokit from '@octokit/rest'

export function getPageTotalCount<T> (result: Octokit.Response<T>) {
  const links = result.headers.link.split(',').map(
    (text) => text.split(';').map((part) => part.trim()),
  )
  const last = links.find((link) => link[1] === 'rel="last"')
  if (last) {
    const [, count] = /page=(\d+)>/.exec(last[0])
    return parseInt(count, 10)
  } else if (Array.isArray(result.data)) {
    return result.data.length
  }
  return 0
}
