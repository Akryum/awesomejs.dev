import { onCreate } from '@nodepack/app-context'
import { Context } from '../context'
import npmFetch, { Options } from 'npm-registry-fetch'
import mem from 'p-memoize'
import ms from 'ms'

onCreate(async (context: Context) => {
  context.npm = mem(npmFetch.json, {
    maxAge: ms('1s'),
  })
})

export default interface NpmContext {
  npm: (url: string, opts?: Options) => Promise<any>
}
