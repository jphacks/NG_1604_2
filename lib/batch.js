'use strict'

require('dotenv').load()

const fb = require('./firebase')
const config = require('../config/config')
const User = require('../app/models/users')
const axios = require('axios')
const Promise = require('bluebird')

const batch = () => {
  console.log('batch')

  analysis()
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })

  //extractNamedEntity('私は企業から特別なオファーがもらえる?')
  //analysisMorpheme('私は企業から特別なオファーがもらえる?')
  //calculateSimilarity('静寂', '静か')
}

// ユーザプロフィールを形態素解析してFBでデータを持つ
const analysis = () => {
  return new Promise((resolve, reject) => {
    User.find()
    fb.database().ref('analysis').orderByKey().once('value')
    .then((snapshot) => {
      snapshot.forEach((snap) => {
        const uuid = snap.key
        const userProfile = snap.val()
        console.log(data)
      })
      resolve('ok')
    }).catch((err) => {
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
