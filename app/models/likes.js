'use strict'

/* ちゃんとバリデートもする */
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const UserSchema = new Schema({
  uuid:       {type: String, required: true},
  name:       {type: String, required: true},
  gender:     {type: String, required: true},
  univ:       {type: String, required: true},
  thumb:      {type: String, required: true},
  department: {type: String, required: true}
})

module.exports = mongoose.model('User', UserSchema)

'use strict'

const mongoose = require('mongoose')

