'use strict'

const Like = require('../../models/likes')
const q = require('q')

/*
* GET /api/likes
*/
const index = function* (next) {
  const deferred = q.defer()
  const promise = Like.find().exec()
  promise.then((likes) => {
    console.log(likes)
    deferred.resolve({
      likes: likes,
      message: 'index'
    })
  })
  this.body = yield deferred.promise
}

/*
* GET /api/likes/:id
* @param {integer} id
*/
const show = function* (next) {
  const deferred = q.defer()
  const id = this.params.id
  const promise = Like.findOne({ _id: id }).exec()
  promise.then((like) => {
    deferred.resolve({
      like: like,
      message: 'show'
    })
  })
  this.body = yield deferred.promise
}

/*
* POST /api/users/:id/remove
* @param {integer} id
*/
const remove = function* (next) {
  const deferred = q.defer()
  const id = this.params.id
  const promise = Like.remove({ _id: id }).exec()
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
  remove: remove
}
