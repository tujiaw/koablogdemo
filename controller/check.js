'use strict'

module.exports.checkLogin = async function(ctx, next) {
    if (!ctx.session.user) {
        return ctx.redirect('/user/signin')
    }
    next()
}
