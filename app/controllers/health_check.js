/*
* GET /api/
* return json
*/
const healthCheck = function* (next) {
  this.body = { message: '生きてるよー' }
}

module.exports = healthCheck
