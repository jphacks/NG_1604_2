'use strict';

require('dotenv').load()

const Firebase = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messageingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
}
const gooLabId = process.env.GOO_LAB_API
const apiToreId = process.env.API_TORE_API

module.exports = {
  firebase: Firebase,
  gooLabId: gooLabId,
  apiToreId: apiToreId
}
