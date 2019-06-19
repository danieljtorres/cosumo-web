'use strict'
const { validate } = use('Validator')

class AuthController {

  async index({ view, auth, response }) {

    try {
      await auth.check()
    } catch (error) {
      return view.render('login')
    }

    return response.redirect('/')
  }

  async login({ request, auth, session, response }) {
    const userData = request.only(['email', 'password'])
    
    const rules = {
      email: 'required|email',
      password: 'required'
    }

    const messages = {
      'email.required' : 'El correo es obligatorio',
      'email.email': 'El formato es incorrecto',
      'password.required': 'La contraseña es obligatoria'
    }

    const validation = await validate(request.all(), rules, messages)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password'])

      return response.redirect('login')
    }

    try {
      await auth.attempt(userData.email, userData.password)
    } catch (error) {
      session
        .withErrors([{ field: 'login', message: 'Su usuario no existe o los datos son incorrectos' }])
        .flashAll()

      return response.redirect('login')
    }

    return response.redirect('/')
  }

  async logout({ auth, response }) {
    await auth.logout()
    return response.redirect('login')
  }
}

module.exports = AuthController
