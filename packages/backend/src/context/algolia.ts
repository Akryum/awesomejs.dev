import Algolia, { Client as AlgoliaClient } from 'algoliasearch'
import { onCreate, addProp } from '@nodepack/app-context'
import { Context } from '@/context'

onCreate((ctx: Context) => {
  addProp(ctx, 'algolia', () => Algolia(ctx.config.algolia.id, ctx.config.algolia.key))
})

export default interface AlgoliaContext {
  algolia: AlgoliaClient
}
