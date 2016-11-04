'use strict'

require('dotenv').load()

const koa = require('koa')
const cors = require('kcors')
const app = koa()
const mongoose = require('mongoose')
const watch = require('./watch/index')
const port = process.env.PORT || 8080

const origins = {
  origin: '*',
  resource: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With']
}

// 監視
watch()

// AVOID CROSS DOMEIN ISSUE
app.use(cors(origins))

// CONNECT MONGODB
const mongo = {
  db: process.env.MONGODB_URI,
  options: {}
}
mongoose.Promise = require('q').Promise
mongoose.connect(mongo.db, mongo.options)

// Run Server
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`)
})

// Catch Error
app.on('erorr', (err) => {
  log.error('server error', err)
})

app.use(function* (next) {
  const start = new Date
  yield next
  const ms = new Date - start
  console.log(`${this.method} ${this.url} - ${ms}`)
})

// define route
const router = require('./app/route')(app)
