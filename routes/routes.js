'use strict'

const Posts = require('../controller/posts')
const User = require('../controller/user')
const Qiniu = require('../controller/qiniu')

module.exports = function(app, route) {
    app.use(route.get('/', Posts.list))
    
    app.use(route.get('/list', Posts.list))
    app.use(route.get('/write', Posts.write))
    app.use(route.get('/post/:id', Posts.show))
    app.use(route.get('/archives', Posts.archives))
    app.use(route.get('/remove/:id', Posts.remove))
    app.use(route.get('/edit/:id', Posts.edit))
    app.use(route.post('/add', Posts.reqAdd))
    app.use(route.post('/edit', Posts.reqEdit))

    app.use(route.get('/user/signin', User.signin))
    app.use(route.get('/user/signout', User.signout))
    app.use(route.post('/user/signin', User.reqSignin))

    app.use(route.get('/uptoken', Qiniu.uptoken))
}
