//Carregando os módulos
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send("Pagina inicial do site")
})
router.get('/contato', (req, res) => {
  res.send("Página de contato")
})

module.exports = router