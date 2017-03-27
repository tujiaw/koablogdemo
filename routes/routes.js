'use strict'

const Posts = require('../controller/posts')
const User = require('../controller/user')

module.exports = function(app, route) {
    app.use(route.get('/', Posts.list))
    
    app.use(route.get('/list', Posts.list))
    app.use(route.get('/write', Posts.write))
    app.use(route.get('/post/:id', Posts.show))
    app.use(route.get('/archives', Posts.archives))
    app.use(route.post('/add', Posts.add))

    app.use(route.get('/user/signin', User.signin))
    app.use(route.get('/user/signout', User.signout))
    app.use(route.post('/user/req-signin', User.reqSignin))
}
