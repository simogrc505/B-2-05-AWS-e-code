const { compose, curry, assoc } = require('ramda')

const append_headers = curry((res, params) => {
  if (params.results.length === 0) {
    return res
      .set('x-total', params.total)
      .set('x-page', params.page)
      .set('x-count', 0)
      .set('x-limit', params.limit)
      .set('x-from', 0)
      .set('x-to', 0)
  } else {
    let to = params.page * parseInt(params.limit)
    let from = (params.page - 1) * parseInt(params.limit) + 1
    to = to > params.results.length ? params.results.length - 1 + from : to
    return res
      .set('x-total', params.total)
      .set('x-page', params.page)
      .set('x-count', params.results.length)
      .set('x-limit', params.limit)
      .set('x-from', from)
      .set('x-to', to)
  }
})

const create_filters = curry((params, results) => {
  return compose(
    assoc('offset', (parseInt(params.page) - 1) * parseInt(params.limit)),
    assoc('limit', parseInt(params.limit)),
    assoc('page', parseInt(params.page))

  )(results)
})

module.exports = {
  append_headers,
  create_filters,
}
