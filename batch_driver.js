const event = {
  
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
const lambda = require('./batch')
lambda.handler(event, context)
