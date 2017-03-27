'use strict'

var UsersModel = require('../models/users');
var MongoHelp = require('../models/mongo').mongoHelp;
var sha1 = require('sha1');

module.exports.signin = async function(ctx) {
    ctx.body = await ctx.render('signin')
}

module.exports.signout = async function(ctx) {
    console.log('-------------signout---------------')
    if (ctx.session.user) {
        ctx.session.user = null
    }
    ctx.redirect('/')
}

module.exports.reqSignin = async function(ctx) {
    const req = ctx.request.body
    if (req.username.length == 0 || req.password.length == 0) {
        ctx.body = 'username or password error'
    }  else {
        let result = await UsersModel.getUserByName(req.username)
        console.log('222:' + result)
        if (!result) {
            console.log('user not find')
            ctx.redirect('back')
            return
        }
        if (sha1(req.password) !== result.password) {
            console.log('password error')
            ctx.redirect('back')
            return
        }

        delete result.password
        ctx.session.user = result
        ctx.redirect('/write')
    }
}

