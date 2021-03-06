const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema

const Usuario = new Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  recuperarsenha: {
    type: String,
    required: false
  },
  nivacesso: {
    type: Schema.Types.ObjectId,
    ref: "nivacesso",
    required: true
  },
  created: {
    type: Date,
    default: Date.now()
  }
})

Usuario.plugin(mongoosePaginate)

mongoose.model("usuario", Usuario)