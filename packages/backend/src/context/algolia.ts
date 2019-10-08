import Algolia from 'algoliasearch'
import { hook } from '@nodepack/app-context'
import { Context } from '@/context'

hook('create', (ctx: Context) => {
  ctx.algolia = Algolia(process.env.ALGOLIA_ID, process.env.ALGOLIA_KEY)
})
