'use strict'

class UserController {
    index ({ view }) {
        return view.render('users.index')
    }
}

module.exports = UserController
