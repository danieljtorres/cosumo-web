'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Hash = use('Hash')

class Device extends Model {

  static boot () {
    super.boot()

    this.addHook('beforeSave', async (instance) => {
      if (instance.dirty.password) {
        instance.password = await Hash.make(instance.password)
      }
    })
  }

  static get computed () {
    return ['is_active']
  }

  static scopeIsActive (query) {
    let now = new Date().getTime()
    return query.whereHas('hires', (builder) => {
      builder.where('status', 1)
    }, '>', 0)
  }

  static scopeIsInactive (query) {
    let now = new Date().getTime()
    return query.whereDoesntHave('hires', (builder) => {
      builder.where('status', 1)
    })
  }

  hires () {
    return this.hasMany('App/Models/Hire')
  }
}

module.exports = Device
