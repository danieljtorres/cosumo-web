'use strict'
const User = use('App/Models/User')
const { validate, validateAll  } = use('Validator')

class UserController {
    async index({ view }) {

        const users = await User.query()
            .orderBy('id', 'desc')
            .fetch()

        return view.render('users.index', { users: users.toJSON() })
    }

    async create({ view }) {
        return view.render('users.create')
    }

    async store({ request, response, session }) {

        const userData = request.only(['username', 'email', 'password'])

        const rules = {
            username: `required|unique:users,username`,
            email: `required|email|unique:users,email`,
            password: 'required|confirmed'
        }

        const messages = {
            'email.required': 'El correo es obligatorio',
            'username.required': 'El usuario es obligatorio',
            'email.email': 'El formato es incorrecto',
            'password.required': 'La contraseña es obligatoria'
        }

        const validation = await validateAll(request.all(), rules, messages)

        if (validation.fails()) {
            session
                .withErrors(validation.messages())

            return response.route('users.create')
        }

        const user = await User.create(userData)
        response.route('users.index')
    }

    async show({ params, view }) {

        const user = await User.findOrFail(params.id)
        return view.render('users.show', { user: user.toJSON(), parseUser: JSON.stringify(user.toJSON()) })
    }

    async update({ params, request, response, session }) {

        const user = await User.findOrFail(params.id)
        const userData = request.only(['email', 'username', 'password'])

        const rules = {
            username: `required|unique:users,username,id,${user.id}`,
            email: `required|email|unique:users,email,id,${user.id}`,
            password: 'confirmed'
        }

        const messages = {
            'email.required': 'El correo es obligatorio',
            'username.required': 'El usuario es obligatorio',
            'email.email': 'El formato es incorrecto',
            'password.required': 'La contraseña es obligatoria'
        }

        const validation = await validateAll(request.all(), rules, messages)

        if (validation.fails()) {
            session
                .withErrors(validation.messages())

            return response.route('users.show', { id: user.id })
        }

        user.fill(userData)
        await user.save()

        response.route('users.show', { id: user.id })
    }

    async delete({ params, response }) {
        console.log(params.id)
        if (params.id != 1) {
            const user = await User.find(params.id)
            await user.delete()
        }
        return response.route('users.index')
    }
}

module.exports = UserController
