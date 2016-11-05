'use strict'

/* ちゃんとバリデートもする */
const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schema
const UserSchema = new Schema({
  uuid:        {type: String, required: true},
  name:        {type: String, required: true},
  gender:      {type: String, required: true},
  grade:       {type: Number, required: true},
  univ_name:   {type: String, required: true},
  univ_id:     {type: String, required: true},
  profile:     {type: String, default: ''},
  profileImg:  {type: String, required: true},
  department:  {type: String, required: true},
  classrooms: {
  	mon:       {type: String, default: '0,0,0,0,0'},
  	tue:       {type: String, default: '0,0,0,0,0'},
  	wed:       {type: String, default: '0,0,0,0,0'},
  	thu:       {type: String, default: '0,0,0,0,0'},
  	fri:       {type: String, default: '0,0,0,0,0'}
  },
  recommends:  {type: String, default: ''},
  createdAt:   {type: Date, default: moment()}
})

// 大学

module.exports = mongoose.model('User', UserSchema)
