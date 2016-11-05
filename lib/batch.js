'use strict'

require('dotenv').load()

const fb = require('./firebase')
const config = require('../config/config')
const User = require('../app/models/users')
const analyze = require('./analyze')
const axios = require('axios')
const Promise = require('bluebird')

const batch = () => {
  console.log('batch')

  const promise = User.find().exec()
  promise.then((users) => {
    users.map((user) => {
      console.log(user.name)
      analyze.calculateTF(user.uuid)
    })
  })

  analysis()
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })
}

// ユーザプロフィールを形態素解析してFBでデータを持つ
const analysis = () => {
  let users = {}
  return new Promise((resolve, reject) => {
    fb.database().ref('tf').orderByKey().once('value')
    .then((snapshot) => {
      snapshot.forEach((snap) => {
        const uuid = snap.key
        console.log(uuid)
        const tf = snap.val()
        users[uuid] = tf
      })
      resolve(users)
    })
    .catch((err) => {
      reject(err)
    })
  })
}

// 単語間の類似間
const calculateSimilarity = (word1, word2) => {
  axios.get('https://api.apitore.com/api/8/word2vec-neologd-jawiki/similarity', {
    params: {
      access_token: config.apiToreId,
      word1: word1,
      word2: word2
    }
  }).then((response) => {
    console.log(response.data.similarity)
    return response.data.similarity
  }).catch((err) => {
    console.log(err)
    return 0
  })
}

// バッチ処理
batch()
