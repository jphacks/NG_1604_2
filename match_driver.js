const event = {
  user_id: 1,
  results: [
    {
      opponent_id: 2,
      matching: true
    },
    {
      opponent_id: 3,
      matching: false
    }
  ]
}

const context = {
  invokeid: 'invokeid',
  done: function(message) {
    console.log('done')
    console.log(message)
    return
  },
  fail: function(err) {
    console.log('failed')
    console.log(err)
    return
  }
}

/*
* ローカルでlambda上のように実行
*/
const lambda = require('./match')
lambda.handler(event, context)
