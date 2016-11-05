'use strict'

const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schema
const UnivSchema = new Schema({
  univId:     {type: String, required: true},
  name:       {type: String, required: true},
  createdAt:  {tyope: Date, default: moment()}
})

module.exports = mongoose.model('Univ', UnivSchema)

// const CampusSchema = new Schema({
//   address:    {type: String, required: true},
//   latitude:   {type: }
// })
