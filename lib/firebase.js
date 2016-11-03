'use strict'

const config = require('../config/config')
const https = require('https')
const firebase = require('firebase')

firebase.initializeApp(config.firebase)

class Firebase {
  constructor() {
    this.firebase = require('firebase')
    this.firebase.initializeApp(config.firebase)
  }

  pushNotify(body) {
    const postData = JSON.stringify({
      'to': '/topics/news',
      'priority': 'high',
      'notification': {
        'body': body,
        'sound': 'default'
      }
    })

    const options = {
      hostname: 'fcm.googleapis.com',
      path: '/fcm/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=********'
      }
    }

    const req = https.request(options, (res) => {
      console.log('done')
    })

    req.on('error', (err) => {
      console.log('error occured: ${err.message}')
    })

    req.write(postData)
    req.end()

  }
}

module.exports = firebase
