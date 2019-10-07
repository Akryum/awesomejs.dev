import { hook } from '@nodepack/app-context'
import { Context } from '../context'
import npmFetch from 'npm-registry-fetch'
import mem from 'p-memoize'
import ms from 'ms'

hook('create', async (context: Context) => {
  context.npm = mem(npmFetch.json, {
    maxAge: ms('1s'),
  })
})
