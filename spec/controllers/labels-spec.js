/* eslint-disable no-sequences */
/* eslint-disable no-undef */
/* global beforeEach describe it db_init expect */
/* eslint no-undef: 'error' */

const R = require('ramda')
const request = require('supertest')

describe('upload action', () => {
  beforeEach(db_init)

  let app

  beforeEach((done) => {
    app = require('../../src')
    done()
  })
    fit('should upload a photo', (done) => {
        request(app)
            .post('/v1/upload')
            .set('Authorization', 'Bearer user')
            .attach('file', './spec/helpers/file/gattino.jpeg')
            .end((err, res) => {
                //   console.log(res.body, res.error)
                if (err) {
                    throw err
                }
                expect(R.pick(['name', 'tags'], res.body)).toEqual({
                    name: '1584374752480-lg',
                    tags: '[{"tag":"Nature","perc":97.92724609375},{"tag":"Outdoors","perc":97.31690979003906},{"tag":"Outer Space","perc":87.50558471679688},{"tag":"Astronomy","perc":87.50558471679688},{"tag":"Moon","perc":84.14134216308594}]'
                })
                done()
            })
    })
})
