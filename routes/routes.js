'use strict'

const Article = require('../controller/article')
const User = require('../controller/user')

module.exports = function(app, route) {
    app.use(route.get('/', Article.list))
    
    app.use(route.get('/list', Article.list))
    app.use(route.get('/post/write', Article.write))
    app.use(route.get('/post/:id', Article.show))
    app.use(route.post('/post/add', Article.add))

    app.use(route.get('/user/signin', User.signin))
    app.use(route.post('/user/req-signin', User.reqSignin))
}
