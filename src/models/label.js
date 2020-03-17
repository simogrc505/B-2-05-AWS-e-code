const { Model } = require('objection')

const config = require('config')
const knex = require('knex')(config.db)

Model.knex(knex)

class Label extends Model {
  static get tableName () {
    return 'labels'
  }
}

module.exports = Label
