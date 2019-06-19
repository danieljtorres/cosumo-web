'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require('moment')

class Hire extends Model {

  static get computed () {
    return ['start_date_service', 'end_date_service', 'days_for_expiration', 'pretty_status']
  }

  getStartDateService ({ start_service }) {
    return moment(start_service).format("DD/MM/YYYY")
  }

  getEndDateService ({ end_service }) {
    return moment(end_service).format("DD/MM/YYYY")
  }

  getDaysForExpiration ({ end_service }) {
    const end = moment(end_service)
    const now = moment()
    const days = end.diff(now, 'days')

    if (days > 0) {
      return days + 1
    } else {
      return 0
    }
  }

  getPrettyStatus ({ status }) {
    if (status) {
      return 'Activo'
    }

    return 'Inactivo'
  }

  company () {
    return this.belongsTo('App/Models/Company')
  }
}

module.exports = Hire
