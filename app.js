const path = require('path')
const logger = require('koa-logger')
const route = require('koa-route')
const bodyParser = require('koa-bodyparser')
const co = require('co')
const render = require('koa-swig')
const Koa = require('koa')
const app = new Koa()

app.context.render = co.wrap(render({
  root: path.join(__dirname, 'views'),
  autoescape: true,
  cache: 'memory',
  ext: 'html',
}))

let post = {
  title: '',
  content: '',
  id: 0,
  created_at: '',
}
let posts = []

app.use(logger())
app.use(bodyParser())
app.use(route.get('/', list))
app.use(route.get('/post/new', add))
app.use(route.get('/post/:id', show))
app.use(route.post('/post', create))

async function list(ctx) {
  ctx.body = await ctx.render('list', { posts: posts })
}

async function add(ctx) {
  ctx.body = await ctx.render('new')
}

async function show(ctx, id) {
  const post = posts[id]
  if (!post) {
    ctx.throw(404, 'invalid post id')
  }
  ctx.body = await ctx.render('show', { post: post })
}

async function create(ctx) {
  const post = ctx.request.body
  const id = posts.push(post) - 1
  post.created_at = new Date()
  post.id = id
  ctx.redirect('/')
}

app.listen(3000, () => {
  console.log('listening on port 3000')
})
