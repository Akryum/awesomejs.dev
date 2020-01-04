import { onCreate, addProp } from '@nodepack/app-context'
import { Client as FaunaClient } from 'faunadb'
import { Context } from '../context'

onCreate((context: Context) => {
  addProp(context, 'db', () => new FaunaClient(context.config.db))
})

export default interface FaunaContext {
  db: FaunaClient
}
