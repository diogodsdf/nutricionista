//Carregando os módulo
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/CatPagamento")
const CatPagamento = mongoose.model('catpagamento')
require("../models/Pagamento")
const Pagamento = mongoose.model('pagamento')
require("../models/NivAcesso")
const NivAcesso = mongoose.model('nivacesso')


router.get('/', (req, res) => {
  res.render("admin/index")
})

/** Nivel Acesso **/
router.get('/niv-acesso', (req, res) => {  
  NivAcesso.find().then((nivacesso) => {
      res.render("admin/niv-acesso/index", { nivacessos: nivacesso })
  }).catch((erro) => {
      req.flash("error_msg", "Error: Nivel acesso não encontrado!")
      res.render("admin/niv-acesso/index")
  })

})
//formulario cadastrar -usuario
router.get('/cad-niv-acesso', (req, res) => {
  res.render("admin/niv-acesso/cad")
})
//inserir dados no db -pagamento
//falta fazer verificação se existe repetido
router.post('/add-niv-acesso', (req, res) => {
  var errors = []
  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
      errors.push({ error: "Necessário preencher o campo nome!" })
  }
  if (!req.body.ordem || typeof req.body.ordem == undefined || req.body.ordem == null) {
    errors.push({ error: "Necessário preencher a ordem!" })
}
  if (errors.length > 0) {
      res.render("admin/niv-acesso/cad", { errors: errors })
  } else {
      const addNivacesso = {
          nome: req.body.nome,
          ordem: req.body.ordem
      }
      new NivAcesso(addNivacesso).save().then(() => {
          req.flash("success_msg", "Nivel acesso cadastrado com sucesso!")
          res.redirect('/admin/niv-acesso')
      }).catch((erro) => {
          req.flash("error_msg", "Error: Nivel acesso não foi  cadastrada com sucesso!")
      })
  }
})
//visualizar dados niv-acesso
router.get('/vis-niv-acesso/:id', (req, res) => {
  NivAcesso.findOne({ _id: req.params.id }).then((nivacesso) => {
      res.render("admin/niv-acesso/ver", { nivacesso: nivacesso })
  }).catch((erro) => {
      req.flash("error_msg", "Error: Categoria de pagamento não encontrado!")
      res.render("admin/niv-acesso")
  })
})

//formulario editar
router.get('/edit-niv-acesso/:id', (req, res) => {
  NivAcesso.findOne({ _id: req.params.id }).then((nivacesso) => {
    res.render("admin/niv-acesso/edit", { nivacesso: nivacesso}) 
  }).catch((erro) => {
      req.flash("error_msg", "Error: Não é possível carregar o formulário editar Nivel de Acesso!")
      res.redirect('/admin/niv-acesso')
  })
})
//atualizar dados editados
//falta fazer verificação se existe repetido
router.post('/update-pagamento', (req, res) => {
  Pagamento.findOne({ _id: req.body.id }).then((pagamento) => {
      pagamento.nome = req.body.nome,
          pagamento.valor = req.body.valor,
          pagamento.catpagamento = req.body.catpagamento

      pagamento.save().then(() => {
          req.flash("success_msg", "Pagamento editado com sucesso!")
          res.redirect('/admin/pagamento')
      }).catch((erro) => {
          req.flash("error_msg", "Error: Pagamento não foi editado com sucesso!")
          res.redirect('/admin/pagamento')
      })

  }).catch((erro) => {
      req.flash("error_msg", "Error: Pagamento não encontrado!")
      res.redirect('/admin/pagamento')
  })
})





/** Pagamento **/
router.get('/pagamento', (req, res) => {
  Pagamento.find().populate("catpagamento").then((pagamentos) => {
      res.render("admin/pagamento/index", { pagamentos: pagamentos })
  }).catch((erro) => {
      req.flash("error_msg", "Error: Pagamento não encontrado!")
      res.render("admin/pagamento/index")
  })

})
//visualizar dados pagamento
router.get('/vis-pagamento/:id', (req, res) => {
  Pagamento.findOne({ _id: req.params.id }).populate("catpagamento").then((pagamento) => {
      res.render("admin/pagamento/ver", { pagamento: pagamento })
  }).catch((erro) => {
      req.flash("error_msg", "Error: Pagamento não encontrado!")
      res.render("admin/pagamento")
  })
})
//formulario cadastrar -pagamento
router.get('/cad-pagamento', (req, res) => {
  res.render("admin/pagamento/cad")
})
//inserir dados no db -pagamento
//falta fazer verificação se existe repetido
router.post('/add-pagamento', (req, res) => {
  var errors = []
  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
      errors.push({ error: "Necessário preencher o campo nome!" })
  }
  if (!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null) {
    errors.push({ error: "Necessário preencher o campo valor!" })
}
  if (errors.length > 0) {
      res.render("admin/pagamento/cad", { errors: errors })
  } else {
      const addPagamento = {
          nome: req.body.nome,
          valor: req.body.valor
      }
      new Pagamento(addPagamento).save().then(() => {
          req.flash("success_msg", "Pagamento cadastrado com sucesso!")
          res.redirect('/admin/pagamento')
      }).catch((erro) => {
          req.flash("error_msg", "Error: Pagamento não foi  cadastrada com sucesso!")
      })
  }
})
//formulario editar
router.get('/edit-pagamento/:id', (req, res) => {
  Pagamento.findOne({ _id: req.params.id }).populate("catpagamento").then((pagamento) => {
      CatPagamento.find().then((catpagamentos) => {
          res.render("admin/pagamento/edit", { pagamento: pagamento, catpagamentos: catpagamentos })
      }).catch((erro) => {
          req.flash("error_msg", "Error: Não foi possível carregar as categorias de pagamentos!")
          res.redirect('/admin/pagamento')
      })
  }).catch((erro) => {
      req.flash("error_msg", "Error: Não é possível carregar o formulário editar pagamento!")
      res.redirect('/admin/pagamento')
  })
})
//atualizar dados editados
//falta fazer verificação se existe repetido
router.post('/update-pagamento', (req, res) => {
  Pagamento.findOne({ _id: req.body.id }).then((pagamento) => {
      pagamento.nome = req.body.nome,
          pagamento.valor = req.body.valor,
          pagamento.catpagamento = req.body.catpagamento

      pagamento.save().then(() => {
          req.flash("success_msg", "Pagamento editado com sucesso!")
          res.redirect('/admin/pagamento')
      }).catch((erro) => {
          req.flash("error_msg", "Error: Pagamento não foi editado com sucesso!")
          res.redirect('/admin/pagamento')
      })

  }).catch((erro) => {
      req.flash("error_msg", "Error: Pagamento não encontrado!")
      res.redirect('/admin/pagamento')
  })
})
//deletar dados db pagamento
router.get('/del-pagamento/:id', (req, res) => {
  Pagamento.deleteOne({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Pagamento apagado com sucesso!")
    res.redirect("/admin/pagamento")
  }).catch((error) => {
    req.flash("error_msg", "Error: Pagamento não foi apagado com sucesso!")
    res.redirect("/admin/pagamento")
  })
})


/** Categoria pagamentos cat-pagamento **/
router.get('/cat-pagamento', (req, res) => {
  CatPagamento.find().then((catpagamento) => {
    res.render("admin/cat-pagamento/index", {catpagamentos: catpagamento})
  }).catch((erro) => {
    req.flash("error_msg", "Erro: Categoria de pagamento não encontrado!")
    res.render("admin/cat-pagamento")
  })
})
//visualizar dados cat-pagamento
router.get('/vis-cat-pagamento/:id', (req, res) => {
  CatPagamento.findOne({ _id: req.params.id }).then((catpagamento) => {
      res.render("admin/cat-pagamento/ver", { catpagamento: catpagamento })
  }).catch((erro) => {
      req.flash("error_msg", "Error: Categoria de pagamento não encontrado!")
      res.render("admin/cat-pagamento")
  })
})
//formulario cadastrar cat-pagamento
router.get('/cad-cat-pagamento', (req, res) => {
  res.render("admin/cat-pagamento/cad")
})
//inserir dados no db cat-pagamento
//falta fazer verificação se existe repetido
router.post('/add-cat-pagamento', (req, res) => {
  var errors = []
  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
      errors.push({ error: "Necessário preencher o campo nome!" })
  }
  if (errors.length > 0) {
      res.render("admin/cat-pagamento/cad", { errors: errors })
  } else {
      const addCatPagamento = {
          nome: req.body.nome
      }
      new CatPagamento(addCatPagamento).save().then(() => {
          req.flash("success_msg", "Categoria de pagamento cadastrado com sucesso!")
          res.redirect('/admin/cat-pagamento')
      }).catch((erro) => {
          req.flash("error_msg", "Error: Categoria de pagamento não foi  cadastrada com sucesso!")
      })
  }
})
//formulario editar
router.get('/edit-cat-pagamento/:id', (req, res) => {
  CatPagamento.findOne({ _id: req.params.id }).then((catpagamento) => {
    res.render("admin/cat-pagamento/edit", {catpagamento: catpagamento})
  }).catch((error) => {
    req.flash("error_msg", "Error: categoria de pagamento não encontrada!")
    res.render("/admin/cat-pagamento")
  })
})
//atualizar dados editados
//falta fazer verificação se existe repetido
router.post('/update-cat-pagamento', (req, res) => {
  CatPagamento.findOne({ _id: req.body.id }).then((catpagamento) => {
    catpagamento.nome = req.body.nome
    catpagamento.save().then(() => {
      req.flash("success_msg", "Categoria de pagamento editado com sucesso")
      res.redirect("/admin/cat-pagamento")
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria de pagamento não encontrado!")
        res.redirect("/admin/cat-pagamento")
    })
  }).catch((erro) => {
    req.flash("error_msg", "Error: Categoria de pagamento não encontrado!")
    res.redirect("/admin/cat-pagamento/index")
  })
})
//deletar dados db cat-pagamento
//falta fazer validação depois de cadastrar os pagamento verificar se existe pagamento
router.get('/del-cat-pagamento/:id', (req, res) => {
  CatPagamento.deleteOne({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Categoria de pagamento apagado com sucesso!")
    res.redirect("/admin/cat-pagamento")
  }).catch((error) => {
    req.flash("error_msg", "Error: Categoria de pagamento não foi apagado com sucesso!")
    res.redirect("/admin/cat-pagamento")
  })
})


/** Usuario **/
router.get('/usuario', (req, res) => {
  /*
  Usuario.find().then((usuario) => {
    res.render("admin/usuario/index", {usuarios: usuario})
  }).catch((erro) => {
    req.flash("error_msg", "Erro: Usuario não encontrado!")
    res.render("admin/usuario")
  })
  */
})

module.exports = router