/* eslint-disable prefer-promise-reject-errors */
const request = require('request')
const config = require('config')

module.exports = (token) => new Promise((resolve, reject) => {
  request.get({
    uri: config.endpoints.user + 'me',
    method: 'GET',
    json: true,
    headers: {
      authorization: `Bearer ${token}`,
    },
  }, (err, response) => {
    if (err || response.statusCode >= 400) {
      return reject({ message: response.body, status: response.statusCode })
    }

    return resolve(response.body)
  })
})
