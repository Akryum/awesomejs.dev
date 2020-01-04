import { onCreate, addProp } from '@nodepack/app-context'
import { Context } from '../context'
import npmFetch, { Options } from 'npm-registry-fetch'
import mem from 'p-memoize'
import ms from 'ms'

type NpmFunction = (url: string, opts?: Options) => Promise<any>

onCreate(async (context: Context) => {
  addProp(context, 'npm', () => mem(npmFetch.json, {
    maxAge: ms('1s'),
  }))
})

export default interface NpmContext {
  npm: NpmFunction
}
