'use strict'

const fb = require('../../../lib/firebase')
const User = require('../../models/users')
const analyze = require('../../../lib/analyze')
const q = require('q')

const match = require('./match')

/*
* GET /api/users
*/
const index = function* (next) {
  const deferred = q.defer()
  const promise = User.find().exec()
  promise.then((users) => {
    console.log(users)
    deferred.resolve({
      users: users,
      message: 'index'
    })
  })
  this.body = yield deferred.promise
}

/*
* GET /api/users/:uuid
* @param {integer} uuid
*/
const show = function* (next) {
  const deferred = q.defer()
  const uuid = this.params.uuid
  const promise = User.findOne({ uuid: uuid }).exec()
  promise.then((user) => {
    console.log(user)
    const recommend = user.recommends.split(',')
    const recommends = recommend.map((elem) => {
      return {uuid: elem}
    })
    const promise2 = User.find({ '$or': recommends }).exec()
    promise2.then((users) => {
      console.log(users)
    })
    deferred.resolve({
      user: user,
      recommends: [user, user, user, user, user],
      message: 'show'
    })
  })
  this.body = yield deferred.promise
}

/*
* POST /api/users/
*/
const create = function* (next) {
  const deferred = q.defer()
  const body = this.request.body
  const user = new User(body)
  user.save()
  analyze(user)
  this.body = {
    user: user,
    message: 'create'
  }

  // fb set
  fb.database().ref(`users/${body.uuid}`).set(body)
}

/*
* POST /api/users/:uuid
* @param {integer} uuid
*/
const update = function* (next) {
  const deferred = q.defer()
  const uuid = this.params.uuid
  const body = this.request.body
  const promise = User.update({ uuid: uuid }, { $set: body }, { upsert: false, multi: true }).exec()
  promise.then(() => {
    analyze({
      uuid: uuid,
      profile: body.profile || ''
    })
    deferred.resolve({
      message: 'updated'
    })
  })

  // fb set
  fb.database().ref(`users/${uuid}`).set(body)

  this.body = yield deferred.promise
}

/*
* POST /api/users/:uuid/remove
* @param {integer} uuid
*/
const remove = function* (next) {
  const deferred = q.defer()
  const uuid = this.params.uuid
  const promise = User.remove({ uuid: uuid }).exec()
  promise.then(() => {
    deferred.resolve({
      message: 'deleted'
    })
  })
  this.body = yield deferred.promise
}

module.exports = {
  index: index,
  show: show,
  create: create,
  update: update,
  remove: remove,
  match: match
}