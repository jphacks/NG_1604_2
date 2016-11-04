'use strict'

const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schama
const LikeSchema = new Schema({
  uuid:       {type: String, required: true},
  like_to:    {type: String, required: true},
  is_match:   {type: Boolean, default: false},
  createdAt:  {type: Date, default: moment()}
})

module.exports = mongoose.model('Like', LikeSchema)
