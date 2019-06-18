'use strict'
const User = use('App/Models/User')
const Device = use('App/Models/Device')

class ResumeController {
  async index({ view }) {
    
    const users = await User.query()
      .where('id', '>', 1)
      .getCount()

    const activeDevices = await Device.query()
      .isActive()
      .getCount()

    const inactiveDevices = await Device.query()
      .isInactive()
      .getCount()

    return view.render('index', { users: users.toString(), activeDevices: activeDevices.toString(), inactiveDevices: inactiveDevices.toString() })
  }
}

module.exports = ResumeController
