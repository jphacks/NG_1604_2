'use strict'

const fb = require('../../../lib/firebase')
const User = require('../../models/users')
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
    deferred.resolve({
      user: user,
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
  this.body = {
    user: user,
    message: 'create'
  }
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
    deferred.resolve({
      message: 'updated'
    })
  })
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
  remove: remove
  match: match
}