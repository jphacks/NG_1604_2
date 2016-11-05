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
    const recommends = recommend.map((elem) => {
      return {uuid: elem}
    })
    const promise2 = User.find({ '$or': recommends }).exec()
    promise2.then((users) => {
      console.log(users)
    })
    const u = {
      "name": "村田雄介",
      "gender": "男性",
      "univ_name": "名古屋大学",
      "univ_id": "meijyo",
      "department": "理工学部",
      "grade": 4,
      "profile": "アジア各国の英語教育について考えています。使い古したスマートフォンで英語教育をアジア各国に届けます。",
      "profile_img": "https://pbs.twimg.com/profile_images/378800000730413028/f4285b8685a7b6c95546ed3c5cdb247c_400x400.jpeg",
      "classes": {
        "mon": "1,0,0,1,1",
        "tue": "1,0,0,1,1",
        "wed": "0,0,0,0,0",
        "thu": "0,1,1,1,0",
        "fri": "0,0,0,0,1"
      }
    }
    deferred.resolve({
      user: u,
      recommends: [u, u, u, u, u],
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
  console.log(this.request.body)
  console.log(this.request.body.class_room)
  console.log(this.request.body.gender)
  user.save()
  .then(() => {
    console.log('saved')
    analyze(user)
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
  //
  console.log(this.request.body)
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