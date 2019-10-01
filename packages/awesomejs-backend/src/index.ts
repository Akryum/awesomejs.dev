import './context/fauna'
import './context/npm'
import { bootstrap, printReady } from '@nodepack/app'
import { Context } from './context'

bootstrap(async (context: Context) => {
  printReady()
})
