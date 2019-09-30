import { hook } from '@nodepack/app-context'
import { Client } from 'faunadb'
import { Context } from './context'

hook('create', async (context: Context) => {
  context.db = new Client(context.config.db)
})
