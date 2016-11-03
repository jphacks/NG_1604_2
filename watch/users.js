'use strict'

const fb = require('../lib/firebase')
const usersRef = fb.database().ref('users')

/*
* usersの変更を検知
*/
const watchUsers = () => {
  usersRef.on('value', (snapshot) => {
    console.log(`${snapshot.val()}の変更を検知`)
  }, (errorObject) => {
    console.log(`the read failed: ${errorObject.code}`)
  })
}

module.exports = watchUsers
