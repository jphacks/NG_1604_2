'use strict';

const Router = require('koa-router')
const path = require('path')
const json = require('koa-json')
const body = require('koa-body')()

const users = require('./controllers/users/index')
const likes = require('./controllers/likes/index')
const healthCheck = require('./controllers/health_check')

const route = (app) => {
  // json対応
  app.use(json())

  const API = new Router({
    prefix: '/api'
  })

  API
    .get('/', healthCheck)

    .get('/users', users.index)
    .get('/users/:uuid', users.show)
    .post('/users', body, users.create)
    .post('/users/:uuid', body, users.update)
    .post('/users/:uuid/remove', body, users.remove)
    .post('/users/:uuid/match', body, users.match)
    

    .get('/likes', likes.index)
    .get('/likes/:id', likes.show)
    .post('/likes/:id/remove', body, likes.remove)

  app
    .use(API.routes())
    .use(API.allowedMethods())

  app.use(function* (next) {
    yield next
    console.log('after response')
  })
}

module.exports = route
