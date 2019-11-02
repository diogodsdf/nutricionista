const express = require("express");
const app = express();
const handlebars =  require("express-handlebars");
const bodyParser = require('body-parser')
const moment = require('moment')
const session = require('express-session')
const flash = require('connect-flash')
//const Pagamento = require("./models/Pagamento")
const path = require("path")

//Formatar data

// Configurações
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: {
    formatDate: (date) => {
      return moment(date).format('DD/MM/YYYY')
    }
  }
}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static(path.join(__dirname, "public")))
// Rotas
app.get('/pagamentos', function(req, res){
  res.render('pagamento');
});
app.get('/cad-pagamento', function(req, res){
  res.render('cad-pagamento');
});
app.post('/add-pagamento', function(req, res){
  res.send("Nome: " + req.body.nome + "<br>Valor: " + req.body.valor + "<br>") 
});

app.listen(8080);