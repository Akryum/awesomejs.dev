import './fauna'
import { bootstrap, printReady } from '@nodepack/app'
import { Context } from './context'

bootstrap(async (context: Context) => {
  printReady()
})
