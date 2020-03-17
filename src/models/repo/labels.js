const { tap, omit, compose } = require('ramda')
const { if_exists, if_already_exists } = require('../../utilities/errors_code')
const Label = require('../label')

module.exports = {
  get: (id) => {
    return Label.query()
      .where({ id })
      .first()
  },
  create: (body) => {
 // return knex('labels').insert({name: body.name, tags:JSON.stringify(body.tags)})
    return Label.query().insert(body)
    //  .then((Label) => Label.query().where({ name: Label.name }))
  },
}
