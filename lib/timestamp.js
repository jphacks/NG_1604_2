'use strict'

const moment = require('moment')

// See: http://qiita.com/taizo/items/3a5505308ca2e303c099
class Timestamp {
  constructor() {
  }

  /*
  * 現在時刻をunix timestampで返す
  */
  unix() {
    return moment().unix() 
  }
}

module.exports = Timestamp
