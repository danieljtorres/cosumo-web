'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HiresSchema extends Schema {
  up () {
    this.create('hires', (table) => {
      table.increments()
      table.integer('start_service', 20).notNullable()
      table.integer('end_service', 20).notNullable()
      table.integer('status', 1).default(1)
      table.integer('device_id').unsigned().references('id').inTable('devices')
      table.integer('company_id').unsigned().references('id').inTable('companies')
      table.timestamps()
    })
  }

  down () {
    this.drop('hires')
  }
}

module.exports = HiresSchema
