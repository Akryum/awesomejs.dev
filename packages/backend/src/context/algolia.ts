import Algolia, { Client as AlgoliaClient } from 'algoliasearch'
import { onCreate } from '@nodepack/app-context'
import { Context } from '@/context'

onCreate((ctx: Context) => {
  ctx.algolia = Algolia(process.env.ALGOLIA_ID, process.env.ALGOLIA_KEY)
})

export default interface AlgoliaContext {
  algolia: AlgoliaClient
}
