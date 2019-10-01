import { hook } from '@nodepack/app-context'
import { Context } from '../context'
import Octokit from '@octokit/rest'

hook('create', async (context: Context) => {
  context.github = new Octokit(context.config.github)
})
