const { pick, map } = require('ramda')

const fields = ['name', 'tags']

module.exports = {
  upload: pick(fields),
  many: map(pick(fields)),
}
