//Carregando os módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express();
const admin = require("./routes/admin")
const site = require("./routes/site")
const path = require("path")
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
require("./config/auth")(passport)

//Configurações
//Sessão
app.use(session({
  secret: 'mfacilonesession',
  resave: false,
  saveUninitialized: true 
}))
app.use(passport.initialize())
app.use(passport.session())
//Flash
app.use(flash())

//Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.error = req.flash("error")
  res.locals.user = req.user || null
  next()
})
//Body Parse
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//Handlebars
app.engine('handlebars', handlebars({defaultLayout: "main"}))
app.set("view engine", 'handlebars')

//Conexão com banco de dados
mongoose.connect('mongodb://localhost/nutricionista', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Conexão com MongoDB realizado com sucesso...")
}).catch((erro) => {
  console.log("Erro: Conexão com MondogoDB não foi realizado com sucesso: " + erro)
})
//Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")))

//Rotas
app.use('/admin', admin)
app.use('/', site)
// Iniciar o Servidor
const PORT = 8080;
app.listen(PORT,() => {
  console.log("Servidor iniciado!");
})

/*
// Definir o Schema
// https://mongoosejs.com/docs/guide.html#definition
const PagamentoSchema = mongoose.Schema({
  nome: {
    type: String,
    require: true
  },
  valor: {
    type: Number,
    require: true
  }
})

//Criar a Model
//https://mongoosejs.com/docs/guide.html#models
var Pagamento = mongoose.model('Pagamentos' , PagamentoSchema)

new Pagamento({
  nome: "Internet",
  valor: 100
}).save().then(() => {
  console.log("Pagamento cadastrado com sucesso")
}).catch((erro) => {
  console.log("Erro: Pagamento não cadastrado com sucesso" + erro)
})
*/