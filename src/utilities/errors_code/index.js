const { always, compose, bind, not, isNil, ifElse, identity } = require('ramda')

const reject = bind(Promise.reject, Promise)
const exists = compose(not, isNil)

// 406
const reject_with_406 = compose(reject, always({ status: 406, message: 'Not acceptable' }))

// 409
const reject_because_already_exists = compose(reject, always({ status: 409, message: 'Already exist' }))

// 404
const reject_because_not_exists = compose(reject, always({ status: 404, message: 'Not found' }))

// 403
const reject_because_forbidden = compose(reject, always({ status: 403, message: 'Forbidden' }))

// 503
const reject_because_server_unavaible = compose(reject, always({ status: 503, message: 'Server unavaible' }))

const if_exists = ifElse(exists, identity, reject_because_not_exists) // 404

const if_already_exists = ifElse(exists, reject_because_already_exists, identity) // 409

const if_authorized = ifElse(exists, identity, reject_because_forbidden) // 403

module.exports = {
  reject_with_406,
  reject_because_already_exists,
  reject_because_forbidden,
  reject_because_not_exists,
  if_exists,
  if_authorized,
  if_already_exists,
  reject_because_server_unavaible,
  exists,
}
