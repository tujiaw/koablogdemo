'use strict'

let post = {
    title: '',
    content: '',
    id: 0,
    created_at: '',
}
let posts = []

module.exports.index = async function(ctx) {
    ctx.body = await ctx.render('index')
}

module.exports.list = async function(ctx) {
    ctx.body = await ctx.render('list', { posts: posts })
}

module.exports.add = async function(ctx) {
    ctx.body = await ctx.render('new')
}

module.exports.show = async function(ctx) {
    const post = posts[id]
    if (!post) {
        ctx.throw(404, 'invalid post id')
    }
    ctx.body = await ctx.render('show', { post: post })
}

module.exports.create = async function(ctx) {
    const post = ctx.request.body
    if (post.title.length == 0 || post.content.length == 0) {
        ctx.body = '提示：文章标题或内容不能为空!'
        return
    }
    const id = posts.push(post) - 1
    post.created_at = new Date()
    post.id = id
    ctx.redirect('/')
}


