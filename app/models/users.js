'use strict'

/* ちゃんとバリデートもする */
const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schema
const UserSchema = new Schema({
  uuid:       {type: String, required: true},
  name:       {type: String, required: true},
  gender:     {type: String, required: true},
  univ:       {type: String, required: true},
  thumb:      {type: String, required: true},
  department: {type: String, required: true},
  createdAt:  {type: Date, default: moment()}
})

module.exports = mongoose.model('User', UserSchema)
