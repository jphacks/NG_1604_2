'use strict'

require('dotenv').load()

const fb = require('./firebase')
const config = require('../config/config')
const axios = require('axios')

const batch = () => {
  console.log('batch')

  extractNamedEntity('私は企業から特別なオファーがもらえる?')
  analysisMorpheme('私は企業から特別なオファーがもらえる?')
  calculateSimilarity('静寂', '静か')
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
  axios.post('https://labs.goo.ne.jp/api/morph', {
    app_id: config.gooLabId,
    info_filter: 'form|pos',
    pos_filter: '名詞',
    sentence: str
  }).then((response) => {
    console.log(response.data.word_list)
    return response.data.word_list
  }).catch((err) => {
    console.log(err)
    return ''
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
