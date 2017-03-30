'use strict'

var PostsModel = require('../models/posts');
var MongoHelp = require('../models/mongo').mongoHelp;
var config = require('config-lite');
var PAGE_COUNT = config.pageCount;

module.exports.test = async function(ctx, next) {
    ctx.body = await ctx.render('test', 'hello')
}

module.exports.list = async function(ctx) {
    var page = ctx.query.page || 1
    page = parseInt(page)
    try {
        const pagePosts = await PostsModel.getPostsProfile(null, page)
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
        const prevPosts = await PostsModel.getPrevPostById(id)
        const nextPosts = await PostsModel.getNextPostById(id)
        await PostsModel.incPv(id)
        if (post) {
            MongoHelp.addOneCreateAt(post)
            MongoHelp.postContent2html(post)
        }
        ctx.body = await ctx.render('show', { 
            post: post, 
            user: ctx.session.user,
            prevPost: prevPosts.length > 0 ? prevPosts[0] : null,
            nextPost: nextPosts.length > 0 ? nextPosts[0] : null
        })
    } catch (err) {
        ctx.throw(err)
    }
}

module.exports.write = async function(ctx) {
    if (!ctx.session.user) {
        ctx.redirect('/user/signin')
        return
    }

    ctx.body = await ctx.render('write', { 
        tags: config.tags 
    })
}

module.exports.reqAdd = async function(ctx) {
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

module.exports.archives = async function(ctx, next) {
    ctx.body = await ctx.render('archives')
}

module.exports.remove = async function(ctx, id) {
    if (!ctx.session.user) {
        ctx.redirect('/user/signin')
        return
    }

    if (!id) {
        ctx.throw(404, 'invalid post id')
    }

    try {
        console.log(`remove author:${ctx.session.user._id}, id:${id}`)
        await PostsModel.delPostById(id, ctx.session.user._id)
        ctx.redirect('/')
    } catch (err) {
        ctx.throw(err)
    }
}

module.exports.edit = async function(ctx, id) {
    if (!ctx.session.user) {
        ctx.redirect('/user/signin')
        return
    }

    if (!id) {
        ctx.throw(404, 'invalid post id')
    }

    try {
        const post = await PostsModel.getRawPostById(id)
        if (!post) {
            ctx.throw('文章不存在')
        }
        if (post.author._id.toString() !== ctx.session.user._id.toString()) {
            ctx.throw('权限不足')
        }
        ctx.render('write', { 
            post: post,
            tags: config.tags
        })
    } catch (err) {
        ctx.throw(err)
    }
}

module.exports.reqEdit = async function(ctx) {
    const user = ctx.session.user
    let post = ctx.request.body

    const title = post.title
    const content = post.content
    const tags = post.tags.split(';')
    if (!post.title || !post.content) {
        ctx.body = await ctx.render('title or content is empty')
        return
    }

    try {
        await PostsModel.updatePostById(post._id, user._id, {
            title: title,
            content: content,
            tags: tags
        })
        ctx.redirect('/')
    } catch (err) {
        ctx.throw(err)
    }
}
