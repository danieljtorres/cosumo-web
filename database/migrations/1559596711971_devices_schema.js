'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DevicesSchema extends Schema {
  up () {
    this.create('devices', (table) => {
      table.increments()
      table.string('internal_id', 80).notNullable().unique()
      table.string('password', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('devices')
  }
}

module.exports = DevicesSchema
