const config = require('../config/config')
const firebase = require('firebase')

firebase.initializeApp(config.firebase)

module.exports = firebase
