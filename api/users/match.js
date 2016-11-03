'use strict'

const fb = require('../../lib/firebase')
const q = require('q')

class Match {
  constructor(body) {
    this.userId = body.user_id
    this.opponentIds = body.opponent_ids
    this.matchesDB = fb.databse().ref(`matches/${this.userId}`)
  }

  /*
  * opponentIdとマッチングするかを確認
  */
  matchingCofirm(opponentId) {
    this.matchesDB.once('value')
      .then((snapshot) => {
        if( snapshot.child(`liked_from/${opponentId}`).exists() ) {
          this.matchingDone(opponentId)
        }
      })
  }

  /*
  * opponentIdとマッチ完了処理
  */
  matchingDone(opponentId) {
    // opponentIdのlike_toリストからuserIdを消去
    // opponentIdのmatcheにuserIdをプッシュ
    // userIdのmatcheにopponentIdをプッシュ
    // 結果を両者にプッシュ通知
    // usersにmatch_doneに入れる
  }

  run() {
    console.log(this.userId)
    console.log(this.opponentIds)
  }
}

/*
* POST /api/users/match
*/
const match = function* (next) {
  const deferred = q.defer()
  const match = new Match(this.request.body)
  match.run()

  // match process
  deferred.resolve({
    message: 'ok'
  })
  // deferred.reject({ message: err })

  this.body = yield deferred.promise 
}

module.exports = match
