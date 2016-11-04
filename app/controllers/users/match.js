'use strict'

const fb = require('../../../lib/firebase')
const User = require('../../models/users')
const Like = require('../../models/likes')
const q = require('q')
const moment = require('moment')

/*
* POST /api/users/:uuid/match
* @param {integer} uuid
*/
const match = function* (next) {
  const deferred = q.defer()
  const uuid = this.params.uuid
  const likeList = this.request.body.like_list.split(',')
  const dislikeList = this.request.body.dislike_list.split(',')

  for(let i=0; i<likeList.length; i++) {
    likeTo(uuid, likeList[i])
  }

  this.body = {
    message: 'マッチング処理なう'
  }
}

/*
* uuidがuu
*/
const likeTo = (uuid, opponent_uuid) => {
  const promise = Like.count({ uuid: uuid, like_to: opponent_uuid }).exec()
  promise.then((count) => {
    console.log(count)
    if(count > 0) {
      likeEachOther(uuid, opponent_uuid)
    } else {
      oneWayLove(uuid, opponent_uuid)
    }
  })
}

// uuid like opponent_uuid each other
const likeEachOther = (uuid, opponent_uuid) => {
  // uuid like opponent_uuid
  const like = new Like({
    uuid: uuid,
    like_to: opponent_uuid,
    is_match: true
  })
  like.save()

  // opponent_uuid liked uuid
  const promise = Like.update({ uuid: opponent_uuid, like_to: uuid }, { $set: { is_match: true } }, { upsert: false, multi: true }).exec()
  promise.then(() => {
    console.log('相互いいねDone')
    createNewRoom(uuid, opponent_uuid)
  })
}

// createPrivateRoom(uuid, opponent_uuid)
const createPrivateRoom = (uuid, opponent_uuid) => {

}

// uuid like opponent_uuid
const oneWayLove = (uuid, opponent_uuid) => {
  const like = new Like({
    uuid: uuid,
    like_to: opponent_uuid
  })
  like.save()
}


const match = function* (next) {
  const deferred = q.defer()
  const matchProcess = new Match(this.request.body)
  matchProcess.run()

  // match process
  deferred.resolve({
    message: 'ok'
  })
  // deferred.reject({ message: err })

  this.body = yield deferred.promise 
}

module.exports = match