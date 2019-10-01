import { hook } from '@nodepack/app-context'
import { Context } from '../context'
import npmFetch from 'npm-registry-fetch'

hook('create', async (context: Context) => {
  context.npm = npmFetch
})
