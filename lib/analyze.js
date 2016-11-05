'use strict'

const fb = require('./firebase')
const config = require('../config/config')
const User = require('../app/models/users')
const axios = require('axios')
const flatten = require('array-flatten')
const async = require('async')
const Promise = require('bluebird')

const analyze = (user) => {
  const uuid = user.uuid

  //analysisMorpheme(user.profile || '')
  analysisMorpheme('現在は、卒業研究として、Pythonを用いてTwitterとApp Storeの関係性の分析を行っています。プログラミングを独学で勉強中。また、Webマガジンの立ち上げ・運営やフリーペーパーの発行も過去に経験あります。大学3年生のときに東京のB2BSaaS分野のスタートアップにて長期インターン。約3ヶ月間、毎週名古屋から通い、自社Webメディアの運営を行っていました。 ジョジョが好きです。')
  .then((word_lists) => {
    const words = flatten(word_lists)
    const noun = words.reduce((result, item) => {
      result[item] = true
      return result
    }, {})
    console.log(noun)
    fb.database().ref(`analysis/${uuid}`).set(noun)
  })
  .catch((err) => {
  	console.log(err)
  })
}

const calculateTF = (uuid) => {
  const promise = User.findOne({ uuid: uuid }).exec()
  promise.then((user) => {
    analysisMorpheme(user.profile)
    .then((word_lists) => {
      const words = flatten(word_lists)
      let tf = {}
      words.map((word) => {
        if(tf[word]) {
          tf[word] += 1
        } else {
          tf[word] = 1
        }
      })
      fb.database().ref(`tf/${uuid}`).set(tf)
    })
  })
}

// TF-ITF算出
const calculate = () => {
  const promise = User.find().exec()
  let tf = {}, idf = {}
  promise.then((users) => {
    const D = users.length
    async.map(users, (user, next) => {
      tf[user.uuid] = {}
      analysisMorpheme(user.profile)
      .then((word_lists) => {
        const words = flatten(word_lists)
        const N = words.length
        words.map((word) => {
          if(tf[user.uuid][word]) {
            tf[user.uuid][word] += 1
          } else {
            tf[user.uuid][word] = 1
          }
        })
        fb.databse().ref(`tf/${user.uuid}`).set(tf[user.uuid])
        next(null, tf[user.uuid])
      })
    }, (err, results) => {
      console.log(results)
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
    if(str.length === 0) resolve([])

    axios.post('https://labs.goo.ne.jp/api/morph', {
      app_id: config.gooLabId,
      info_filter: 'form|pos',
      pos_filter: '名詞',
      sentence: str
    }).then((response) => {
      resolve(response.data.word_list)
    }).catch((err) => {
      reject(err)
    })
  })
}

module.exports = {
  analyze: analyze,
  calculate: calculate,
  calculateTF: calculateTF
}

