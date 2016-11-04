'use strict';

const Router = require('koa-router')
const path = require('path')
const json = require('koa-json')
const body = require('koa-body')()

const users = require('./controllers/users/index')
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
    //.post('/match', body, users.match)

  app
    .use(API.routes())
    .use(API.allowedMethods())

  app.use(function* (next) {
    yield next
    console.log('after response')
  })
}

module.exports = route
