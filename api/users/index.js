'use strict'

const fb = require('../../lib/firebase')
const q = require('q')

const match = require('./match')

/*
* GET /api/users/fetch
* userID
*/
const fetch = function* (next) {
  const deferred = q.defer()
  const userID = this.params.user_id

  this.body = yield deferred.promise
}

/*
* POST /api/users
*
*/
const update = function* (next) {
  const deferred = q.defer()
  const userID = this.request.body.user_id

  // update process
  deferred.resolve({
    message: 'ok'
  })
  // deferred.reject({ message: err })

  this.body = yield deferred.promise
}

module.exports = {
  fetch: fetch,
  update: update,
  match: match
}
