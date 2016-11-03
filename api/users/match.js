'use strict'

const fb = require('../../lib/firebase')
const timestamp = new (require('../../lib/timestamp'))()
const q = require('q')

class Match {
  constructor(body) {
    this.userId = body.user_id
    this.opponentIds = body.opponent_ids.split(',')
    this.matchesRef = fb.database().ref(`matches/${this.userId}`)
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
  * userIdがopponentIdをlikeする
  */
  likeTo(opponentId) {
    this.matchesRef.child(`like_to/${opponentId}`).set({
      timestamp: timestamp.unix()
    }).then(() => {
      console.log(`${this.userId} likes to ${opponentId}.`)
    }).catch((err) => {
      console.log(`error occured: ${err.message}`)
    })
  }

  /*
  * opponentIdがuserIdにlikeされる
  */
  likedBy(opponentId) {
    const opponentRef = fb.database().ref(`matches/${opponentId}`)
    opponentRef.child(`liked_from/${this.userId}`).set({
      timestamp: timestamp.unix()
    }).then(() => {
      console.log(`${opponentId} is liked from ${this.userId}.`)
    }).catch((err) => {
      console.log(`error occured: ${err.message}`)
    })
  }

  /*
  * opponentIdとマッチ完了処理
  */
  matchingDone(opponentId) {
    console.log(`${opponentId}とマッチング完了`)

    // ${this.userId}のliked_fromから${opponentId}をRemvoeする
    //this.matchesRef.child(`liked_from/${opponentId}`).remove()
    //  .then(() => {
    //    console.log(`${this.userId}のliked_fromから${opponentId}をRemvoeしました。`)
    //  })
    //  .catch((err) => {
    //    console.log(`Remove failed: ${err.message}`)
    //  })

    // ${opponentId}のlike_toから${this.userId}をRemoveする
    const opponentRef = fb.database().ref(`matches/${opponentId}`)
    //opponentRef.child(`like_to/${this.userId}`).remove()
    //  .then(() => {
    //    console.log(`${opponentId}のlike_toから${this.userId}をRemoveしました。`)
    //  })
    //  .catch((err) => {
    //    console.log(`Remvoe failed: ${err.message}`)
    //  })

    // ${opponentId}のmatcheに${this.userId}をpushする
    opponentRef.child(`matche/${this.userId}`).set({
      timestamp: now
    }).then(() => {
      console.log(`${opponentId}のmatcheに${this.userId}をpushしました。`)
    })
    .catch((err) => {
      console.log(`Push failed: ${err.message}`)
    })

    // ${this.userId}のmatcheに${opponentId}をpushする
    this.matchesRef.child(`matche/${opponentId}`).set({
      timestamp: now
    }).then(() => {
      console.log(`${this.userId}のmatcheに${opponentId}をpushしました。`)
    })
    .catch((err) => {
      console.log(`Push failed: ${err.message}`)
    })

    // 結果を両者にプッシュ通知
    pushNotify(this.userId, opponentId)

    // usersにmatch_doneに入れる
  }

  /*
  * プッシュ通知を送る
  */
  pushNotify(userId) {
    console.log(`${userId}にマッチングお知らせをプッシュします`)
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
