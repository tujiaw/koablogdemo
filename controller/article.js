'use strict'

var PostsModel = require('../models/posts');
var MongoHelp = require('../models/mongo').mongoHelp;
var config = require('config-lite');
var PAGE_COUNT = config.pageCount;

module.exports.index = async function(ctx, next) {
    ctx.body = await ctx.render('index', 'hello')
}

module.exports.list = async function(ctx) {
    var page = 1
    try {
        const pagePosts = await PostsModel.getPostsProfile(null, 1)
        const totalCount = await PostsModel.getPostsCount(null)
        MongoHelp.addAllCreateDateTime(pagePosts);
        MongoHelp.postsContent2Profile(pagePosts);

        var pageNumbers = [];
        var lastPage = Math.ceil(totalCount / PAGE_COUNT);
        if (page <= lastPage) {
            var i = 1;
            if (page <= 3) {
                for (i = 1; i <= page; i++) {
                    pageNumbers.push(i);
                }
                for (i = page + 1; i <= lastPage && pageNumbers.length < 5; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(0);
                for (i = page - 2; i <= Math.min(page + 2, lastPage); i++) {
                    pageNumbers.push(i);
                }
            }
            if (lastPage > i) {
                pageNumbers.push(0);
            }
        }

        ctx.body = await ctx.render('list', {
            posts: pagePosts,
            page: page,
            pageNumbers: pageNumbers,
            lastPage: lastPage,
        })
    } catch (err) {
        ctx.throw(err)
    }
}

module.exports.show = async function(ctx, id) {
    if (!id) {
        ctx.throw(404, 'invalid post id')
    }

    try {
        const post = await PostsModel.getPostById(id)
        await PostsModel.incPv(id)
        if (post) {
            MongoHelp.addOneCreateAt(post)
            MongoHelp.postContent2html(post)
        }
        ctx.body = await ctx.render('show', { post: post })
    } catch (err) {
        ctx.throw(err)
    }
}

// module.exports.new = async function(ctx) {
//     // const post = ctx.request.body
//     // if (post.title.length == 0 || post.content.length == 0) {
//     //     ctx.body = '提示：文章标题或内容不能为空!'
//     //     return
//     // }
//     // const id = posts.push(post) - 1
//     // post.created_at = new Date()
//     // post.id = id
//     // ctx.redirect('/')
// }

module.exports.write = async function(ctx) {
    console.log('112343254235235');
    if (!ctx.session.user) {
        ctx.redirect('/user/signin')
        return
    }

    ctx.body = await ctx.render('write', { 
        tags: config.tags 
    })
}

module.exports.add = async function(ctx) {
    if (!ctx.session.user) {
        ctx.redirect('/user/signin')
        return
    }

    const user = ctx.session.user
    let post = ctx.request.body
    const tags = post.tags.split(';')
    console.log(post);
    if (!post.title || !post.content) {
        ctx.body = await ctx.render('title or content is empty')
        return
    }

    post.author = user._id
    post.pv = 1
    post.tags = tags
    await new PostsModel(post).save()
    ctx.redirect('/');
}