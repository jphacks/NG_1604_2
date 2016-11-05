'use strict'

const fb = require('../../../lib/firebase')
const User = require('../../models/users')
const analyze = require('../../../lib/analyze')
const q = require('q')

const like = require('./like')

/*
* GET /api/users
*/
const index = function* (next) {
  const deferred = q.defer()
  const promise = User.find().exec()
  //
  console.log(this.params)
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
    //const recommends = recommend.map((elem) => {
    //  return {uuid: elem}
    //})
    const recommends = [{uuid: '123456789'}, {uuid: '14141414'}, {uuid: '1313131313'}, {uuid: '121212121212'}]
    const promise2 = User.find({ '$or': recommends }).exec()
    promise2.then((users) => {
      console.log(users)
      deferred.resolve({
        user: user,
        recommends: users,
        message: 'show'
      })
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
  .then(() => {
    console.log('saved')
    analyze.calculateTF(body.uuid)
  })
  .catch((err) => {
    console.log(err)
  })
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
  const promise = User.update({ uuid: uuid }, { $set: body }, { upsert: false, multi: false }).exec()
  promise.then(() => {
    analyze.calculateTF(uuid)
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
  like: like
}