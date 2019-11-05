import { onCreate } from '@nodepack/app-context'
import { Client as FaunaClient } from 'faunadb'
import { Context } from '../context'

onCreate(async (context: Context) => {
  context.db = new FaunaClient(context.config.db)
})

export default interface FaunaContext {
  db: FaunaClient
}
