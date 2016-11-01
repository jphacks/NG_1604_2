'use strict';

const Router = require('koa-router')
const path = require('path')
const json = require('koa-json')
const body = require('koa-body')()

const users = require('./users/index')

const route = (app) => {
  // json対応
  app.use(json())

  const API = new Router({
    prefix: '/api'
  })

  API
    .get('/users/fetch', users.fetch)
    .post('/users', body, users.update)

    .post('/match', body, users.match)

  app
    .use(API.routes())
    .use(API.allowedMethods())

  app.use(function* (next) {
    yield next
    console.log('after response')
  })
}

module.exports = route
