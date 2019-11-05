import { onCreate } from '@nodepack/app-context'
import { Context } from '../context'
import Octokit from '@octokit/rest'

onCreate(async (context: Context) => {
  context.github = new Octokit(context.config.github)
})

export default interface GitHubContext {
  github: Octokit
}

