import { onCreate, addProp } from '@nodepack/app-context'
import { Context } from '../context'
import Octokit from '@octokit/rest'

onCreate(async (context: Context) => {
  addProp(context, 'github', () => new Octokit(context.config.github))
})

export default interface GitHubContext {
  github: Octokit
}
