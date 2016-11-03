'use strict'

const fb = require('../../lib/firebase')
const usersRef = fb.database().ref('users')
const co = require('co')

class User {
  constructor(id) {
    this.id = id
    this.ref = usersRef.child(this.id)
  }

  // ユーザの情報をロードする
  // ロード終わる前にアクセスしてしまう...
  load () {
    this.ref.once('value')
    .then((snapshot) => {
      const snap = snapshot.val()
      console.log(snap)

      this._name = snap.name
      this._univ = snap.univ
      this._grade = snap.grade
      this._profile = snap.profile
      this._profileImg = snap.profile_img
      this._classes = snap.classes
      this._chats = snap.chats
    })
    .catch((err) => {
      console.log(err)
    })
  }

  name() {
    const that = this
    if(this._name) {
      console.log(1)
      return this._name
    }
    co(function* () {
      let name
      console.log(0)
      that.ref.once('value')
      .then((snapshot) => {
        console.log(33333333)
        console.log(name)
        name = snapshot.val().name
        return name
      })
    }).then((name) => {
      that._name = name
      console.log(111111)
      return name
    }).catch((err) => {
      console.log(err)
    })
  }
}

module.exports = User
