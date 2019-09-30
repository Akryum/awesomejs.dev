import { ExpressContext } from '@nodepack/plugin-express'
import hello from '@/views/hello.ejs'

export default function ({ express: app }: ExpressContext) {
  app.get('/', (req, res) => {
    res.send(hello({ user: req.user }))
  })

  app.get('/foo/:foo', (req, res) => {
    res.send(`Foo: ${req.params.foo}`)
  })
}
