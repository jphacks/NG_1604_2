'use strict';

require('dotenv').load()

const Promise = require('bluebird')

/*
* マッチング結果から単語-ユーザ間の重み等を修正
* @constructor
* @classdec 結果から重みを修正
* @params {object Array} results
*/
class Match {
  constructor(results) {
    this.results = results
  }

  /*
  * マッチングの結果から単語間やユーザ間の重みを修正
  */
  learn() {
    return new Promise((resolve, reject) => {
      resolve(this.results)
      //reject()
    })
  }
}

exports.handler = function(event, context) {
  const user_id = event.user_id
  const results = event.results
  const match = new Match(results)

  match.learn()
  .then((data) => {
    context.done(data)
  })
  .catch((err) => {
    context.fail(err)
  })
}
