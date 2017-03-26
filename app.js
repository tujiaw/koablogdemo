const path = require('path')
const logger = require('koa-logger')
const route = require('koa-route')
const bodyParser = require('koa-bodyparser')
const co = require('co')
const render = require('koa-swig')
const session = require('koa-session');
const serve = require('koa-static')
const Koa = require('koa')
const app = new Koa()

app.key = ['sdgsdgdsg']
app.use(logger())
app.use(serve(path.join(__dirname, 'public')))
app.use(session(app))
app.use(bodyParser())
app.context.render = co.wrap(render({
  root: path.join(__dirname, 'views'),
  autoescape: true,
  cache: 'memory',
  ext: 'html',
}))

require('./routes/routes')(app, route)

app.listen(3000, () => {
  console.log('listening on port 3000')
})
