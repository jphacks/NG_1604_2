'use strict'

require('dotenv').load()

const fb = require('./firebase')
const config = require('../config/config')
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
    fb.database().ref('users').orderByKey().once('value')
    .then((snapshot) => {
      snapshot.forEach((snap) => {
        const key = snap.key
        const data = snap.val()
        console.log(data)
      })
      resolve('ok')
    }).catch((err) => {
      reject(err)
    })
  })
}

// 固有表現抽出
const extractNamedEntity = (str) => {
  axios.post('https://labs.goo.ne.jp/api/entity', {
    app_id: config.gooLabId,
    //class_filter: '',
    sentence: str
  }).then((response) => {
    console.log(response.data.ne_list)
    return response.data.ne_list
  }).catch((err) => {
    console.log(err)
    return []
  })
}

// 形態素解析
const analysisMorpheme = (str) => {
  return new Promise((resolve, reject) => {
    axios.post('https://labs.goo.ne.jp/api/morph', {
      app_id: config.gooLabId,
      info_filter: 'form|pos',
      pos_filter: '名詞',
      sentence: str
    }).then((response) => {
      console.log(response.data.word_list)
      resolve(response.data.word_list)
    }).catch((err) => {
      console.log(err)
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
