
exports.up = function (knex, Promise) {
  return knex.schema.createTable('labels', function (t) {
    t.charset('utf8')
    t.collate('utf8_general_ci')
    t.string('name').primary()
    t.json('tags')
  })
}

exports.down = function (knex, Promise) {
}
