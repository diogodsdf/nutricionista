const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    }, 
    email: {
        type: email,
        required: true
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

mongoose.model("usuario", Usuario)