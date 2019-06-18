'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CompaniesSchema extends Schema {
  up () {
    this.create('companies', (table) => {
      table.increments()
      table.string('name', 80).notNullable().unique()
      table.string('contact_name', 80).notNullable().unique()
      table.string('contact_phone', 80).notNullable().unique()
      table.string('contact_email', 80).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('companies')
  }
}

module.exports = CompaniesSchema
