const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NivAcesso = new Schema({
    nome: {
        type: String,
        required: true
    },
    ordem: {
      type: Number,
      required: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("nivacesso", NivAcesso)