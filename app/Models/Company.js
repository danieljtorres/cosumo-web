'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Company extends Model {
  static get table() {
    return 'companies'
  }
}

module.exports = Company
