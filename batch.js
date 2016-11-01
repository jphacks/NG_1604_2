'use strict';

require('dotenv').load()

const Promise = require('bluebird')

/*
* 1日1回の定期実行。ユーザのプロフィールなどから各ユーザに10人をレコメンドする。
* @constructor
* @classdec レコメンドバッチ
* @params None
*/
class Batch {
  constructor() {
  }

  /*
  * データを整形するための前処理
  */
  preprocess() {
  }

  /*
  * ユーザに対して10人をレコメンド
  */
  recommend() {
  }

  /*
  * 処理
  */
  run() {
    return new Promise((resolve, reject) => {
      try {
        this.preprocess()
        this.recommend()
        resolve('done')
      }
      catch(e) {
        reject(e)
      }
    })
  }
}

exports.handler = function(event, context) {
  const batch = new Batch()

  batch.run()
  .then((data) => {
    context.done(data)
  })
  .catch((err) => {
    context.fail(err)
  })
}
