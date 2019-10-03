import './context/fauna'
import './context/npm'
import './context/github'
import './passport'
import { bootstrap, printReady } from '@nodepack/app'
import { Context } from './context'
import morgan from 'morgan'
import { hook } from '@nodepack/app-context'

hook('expressCreate', (ctx: Context) => {
  ctx.express.use(morgan('dev'))
  ctx.express.use(morgan(':method :url req-cookie: :req[cookie] res-set-cookie: :res[set-cookie]'))
})

// hook('expressAuth', (ctx: Context) => {
//   ctx.express.use((req: any, res, next) => {
//     req.session = new Proxy(req.session, {
//       get (target, key, receiver) {
//         console.log('get session', key, new Error().stack)
//         setTimeout(() => {
//           console.log(JSON.stringify(req.session))
//         })
//         return Reflect.get(target, key, receiver)
//       },
//       set (target, key, value, receiver) {
//         console.log('set session', key, '=', JSON.stringify(value), new Error().stack)
//         setTimeout(() => {
//           console.log(JSON.stringify(req.session))
//         })
//         return Reflect.set(target, key, value, receiver)
//       }
//     })
//     next()
//   })
// })

bootstrap(() => {
  printReady()
})
