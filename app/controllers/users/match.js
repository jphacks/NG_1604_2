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
  const result = this.request.body.match_result

  if(result === true) {
    likeTo(uuid, opponent_uuid)
  }

  this.body = {
    message: 'マッチング処理なう'
  }
}

/*
* uuidがopponent_uuidをlikeする
*/
const likeTo = (uuid, opponent_uuid) => {
  // opponent_uuid like uuid ならば
  const promise = Like.count({ uuid: opponent_uuid, like_to: uuid, is_match: false }).exec()
  promise.then((count) => {
    console.log(`${count}個存在します`)
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
  const promise = Like.update({ uuid: opponent_uuid, like_to: uuid }, { $set: { is_match: true } }, { upsert: true, multi: true }).exec()
  promise.then(() => {
    console.log('相互いいねDone')
    createPrivateRoom(uuid, opponent_uuid)
    console.log('ちゃんと作れてる？')
  })
}

// createPrivateRoom(uuid, opponent_uuid)
const createPrivateRoom = (uuid, opponent_uuid) => {
  console.log('createChatRoom')
  const now = moment().unix()
  
  const newChatRoom = fb.database().ref('chatrooms').push()

  const promise1 = User.findOne({ uuid: uuid }).exec()
  promise1.then((user) => {
    const promise2 = User.findOne({ uuid: opponent_uuid }).exec()
    promise2.then((opponent) => {
      let chatRoom = {
        title: `${user.name}と${opponent.name}の部屋`,
        lastMessage: 'プライベートルームです。',
        isPublic: false,
        timestamp: now,
        members: {}
      }
      chatRoom['members'][uuid] = { name: user.name }
      chatRoom['members'][opponent_uuid] = { name: opponent.name }

      newChatRoom.set(chatRoom)
      console.log(`${user.name}と${opponent.name}のチャットルームを作成しました。`)

      // ユーザから参照できるように
      fb.database().ref(`users/${uuid}/matches/${opponent_uuid}`).set({
        timestamp: now,
        room_id: newChatRoom.key
      })

      fb.database().ref(`users/${opponent_uuid}/matches/${uuid}`).set({
        timestamp: now,
        room_id: newChatRoom.key
      })
    })
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
