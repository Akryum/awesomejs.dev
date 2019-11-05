import Algolia, { Client as AlgoliaClient } from 'algoliasearch'
import { onCreate } from '@nodepack/app-context'
import { Context } from '@/context'

onCreate((ctx: Context) => {
  ctx.algolia = Algolia(ctx.config.algolia.id, ctx.config.algolia.key)
})

export default interface AlgoliaContext {
  algolia: AlgoliaClient
}
