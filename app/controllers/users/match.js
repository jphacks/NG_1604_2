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
  const opponent_uuid = this.request.body.opponent_uuid
  const result = this.request.body.result

  if(result === true) {
    likeTo(uuid, opponent_uuid)
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
  const now = moment().unix()
  let chatRoom = {
    title: 'AAAAAAAAAAA',
    lastMessage: 'プライベートルームです。',
    isPublic: false,
    timestamp: now,
    members: {}
  }
  chatRoom['members'][uuid] = { name: 'ぽこひで' }
  chatRoom['members'][opponent_uuid] = { name: 'ぽこ' }
  const newChatRoom = fb.database.ref('chatrroms').push()
  newChatRoom.set(chatRoom)
  .then(() => {
    console.log('チャットルームを作成しました。')
  }).catch((err) => {
    console.log(err.message)
  })

  // ユーザから参照できるように
  fb.database.ref(`users/${uuid}/matches/${opponent_uuid}`).set({
    timestamp: now,
    room_id: newChatRoom.key
  })
  fb.database.ref(`users/${opponent_uuid}/matches/${uuid}`).set({
    timestamp: now,
    room_id: newChatRoom.key
  })
}

// uuid like opponent_uuid
const oneWayLove = (uuid, opponent_uuid) => {
  const like = new Like({
    uuid: uuid,
    like_to: opponent_uuid
  })
  like.save()
}

module.exports = match