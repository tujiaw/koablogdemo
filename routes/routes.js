'use strict'

const Article = require('../controller/article')
const User = require('../controller/user')

module.exports = function(app, route) {
    app.use(route.get('/', Article.list))
    app.use(route.get('/list', Article.list))
    app.use(route.get('/post/new', Article.add))
    app.use(route.get('/post/:id', Article.show))
    app.use(route.post('/post', Article.create))
}
