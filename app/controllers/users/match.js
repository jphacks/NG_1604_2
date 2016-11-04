'use strict'

const fb = require('../../../lib/firebase')
const timestamp = new (require('../../../lib/timestamp'))()
const User = require('./user')
const q = require('q')

class Match {
  constructor(body) {
    this.user = new User(body.user_id)
    this.matchesRef = fb.database().ref(`matches/${this.user.id}`)

    this.opponentIds = body.like_list.split(',')
    this.dislike = body.dislike_list.split(',') // これは使わないけど一旦
  }

  /*
  * opponentIdとマッチングするかを確認
  */
  matchingCofirm(opponentId) {
    console.log(`${opponentId}とマッチング確認中`)
    this.matchesRef.once('value')
      .then((snapshot) => {
        if( snapshot.child(`liked_from/${opponentId}`).exists() ) {
          this.matchingDone(opponentId)
        } else {
          this.likeTo(opponentId)
          this.likedBy(opponentId)
        }
      })
  }

  /*
  * user.idがopponentIdをlikeする
  */
  likeTo(opponentId) {
    this.matchesRef.child(`like_to/${opponentId}`).set({
      timestamp: timestamp.unix()
    }).then(() => {
      //console.log(`${this.user.id} likes to ${opponentId}.`)
    }).catch((err) => {
      console.log(`error occured: ${err.message}`)
    })
  }

  /*
  * opponentIdがuser.idにlikeされる
  */
  likedBy(opponentId) {
    const opponentRef = fb.database().ref(`matches/${opponentId}`)
    opponentRef.child(`liked_from/${this.user.id}`).set({
      timestamp: timestamp.unix()
    }).then(() => {
      //console.log(`${opponentId} is liked from ${this.user.id}.`)
    }).catch((err) => {
      console.log(`error occured: ${err.message}`)
    })
  }

  /*
  * opponentIdとマッチ完了処理
  */
  matchingDone(opponentId) {
    const opponent = new User(opponentId)
    const now = timestamp.unix()
    console.log(`${opponent.id}とマッチング完了`)

    // ${this.user.id}のliked_fromから${opponent.id}をRemvoeする
    //this.matchesRef.child(`liked_from/${opponent.id}`).remove()
    //  .then(() => {
    //    console.log(`${this.user.id}のliked_fromから${opponent.id}をRemvoeしました。`)
    //  })
    //  .catch((err) => {
    //    console.log(`Remove failed: ${err.message}`)
    //  })

    // ${opponent.id}のlike_toから${this.user.id}をRemoveする
    const opponentRef = fb.database().ref(`matches/${opponent.id}`)
    //opponentRef.child(`like_to/${this.user.id}`).remove()
    //  .then(() => {
    //    console.log(`${opponent.id}のlike_toから${this.user.id}をRemoveしました。`)
    //  })
    //  .catch((err) => {
    //    console.log(`Remvoe failed: ${err.message}`)
    //  })


    // ${opponent.id}のmatcheに${this.user.id}をpushする
    opponentRef.child(`matche/${this.user.id}`).set({
      timestamp: now
    }).then(() => {
      console.log(`${opponent.id}のmatcheに${this.user.id}をpushしました。`)
    })
    .catch((err) => {
      console.log(`Push failed: ${err.message}`)
    })

    // ${this.user.id}のmatcheに${opponent.id}をpushする
    this.matchesRef.child(`matche/${opponent.id}`).set({
      timestamp: now
    }).then(() => {
      console.log(`${this.user.id}のmatcheに${opponent.id}をpushしました。`)
    })
    .catch((err) => {
      console.log(`Push failed: ${err.message}`)
    })

    // ${this.user.id}と${opponent.id}のチャットルームを作成する
    this.createChatRoom(this.user, opponent)

    // 結果を両者にプッシュ通知
    pushNotify(this.user, opponent)

    // usersにmatch_doneに入れる
  }

  /*
  * userとopponentのプライベートルームを作る
  */
  createChatRoom(user, opponent) {
    const now = timestamp.unix()
    let chatRoom = {
      title: 'aaaaaaaaaa',
      lastMessage: 'プライベートルームです。',
      isPublic: false,
      timestamp: now,
      members: {}
    }
    chatRoom['members'][user.id] = { name: 'ぽこひで' }
    chatRoom['members'][opponent.id] = { name: 'ぽこ' }
    console.log(chatRoom)
    fb.database().ref('chats').push().set(chatRoom)
    .then(() => {
      console.log('チャットルームを作成しました。')
    }).catch((err) => {
      console.log(err.message)
    })
  }

  /*
  * プッシュ通知を送る
  */
  pushNotify(user) {
    console.log(`${user}にマッチングお知らせをプッシュします`)
  }


  run() {
    for(let i=0; i<this.opponentIds.length; i++) {
      this.matchingCofirm(this.opponentIds[i])
    }
    console.log('マッチング確認完了')
  }
}

/*
* POST /api/users/match
*/
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