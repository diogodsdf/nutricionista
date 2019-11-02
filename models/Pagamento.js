const db = require('./db')

const Pagamento = db.sequelize.define('pagamentos',{
  nome: {
    type: db.Sequelize.STRING
  },
  valor: {
    type: db.Sequelize.DOBLE
  }
})
// Criar tabela
//Pagamento.sync(force: true)
module.exports = Pagamento