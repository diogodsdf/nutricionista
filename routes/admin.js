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
require("../models/Usuario")
const Usuario = mongoose.model('usuario')


router.get('/', (req, res) => {
  res.render("admin/index")
})

/** Nivel Acesso **/
router.get('/niv-acesso', (req, res) => {
  NivAcesso.find().sort({ ordem: 1 }).then((nivacesso) => {
    res.render("admin/niv-acesso/index", { nivacessos: nivacesso })
  }).catch((erro) => {
    req.flash("error_msg", "Error: Nivel acesso não encontrado!")
    res.render("admin/niv-acesso/index")
  })
})
//formulario cadastrar -usuario
router.get('/cad-niv-acesso', (req, res) => {
  NivAcesso.find().then((nivacesso) => {
    var ordemUtimo = 0
    nivacesso.forEach(nivacesso => {
      if (ordemUtimo < nivacesso.ordem) {
        ordemUtimo = nivacesso.ordem
      }
    });
    ordemUtimo = ordemUtimo + 1
    //console.log(ordemUtimo)
    res.render("admin/niv-acesso/cad", { ordem: ordemUtimo })
  })
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
      ordem: req.body.ordem,
      ref: req.body.ordem
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
    Usuario.find({ nivacesso: nivacesso._id }).sort({created: -1}).limit(20).then((usuarios) => {
      res.render("admin/niv-acesso/ver", { nivacesso: nivacesso, usuarios, usuarios })
    }).catch((error) => {
      req.flash("error_msg", "Error: Usuarios não encontrado!")
      res.render("admin/niv-acesso")
    })

  }).catch((erro) => {
    req.flash("error_msg", "Error: Categoria de pagamento não encontrado!")
    res.render("admin/niv-acesso")
  })
})

//formulario editar
router.get('/edit-niv-acesso/:id', (req, res) => {
  NivAcesso.findOne({ _id: req.params.id }).then((nivacesso) => {
    res.render("admin/niv-acesso/edit", { nivacesso: nivacesso })
  }).catch((erro) => {
    req.flash("error_msg", "Error: Não é possível carregar o formulário editar Nivel de Acesso!")
    res.redirect('/admin/niv-acesso')
  })
})
//atualizar dados editados
//falta fazer verificação se existe repetido
router.post('/update-niv-acesso', (req, res) => {
  NivAcesso.findOne({ _id: req.body.id }).then((nivacesso) => {
    nivacesso.nome = req.body.nome
    nivacesso.ref = nivacesso.ordem
    nivacesso.save().then(() => {
      req.flash("success_msg", "Nível de Acesso editado com sucesso!")
      res.redirect('/admin/niv-acesso')
    }).catch((erro) => {
      req.flash("error_msg", "Error: Nível de Acesso não foi editado com sucesso!")
      res.redirect('/admin/niv-acesso')
    })

  }).catch((erro) => {
    req.flash("error_msg", "Error: Nível de Acesso não encontrado!")
    res.redirect('/admin/niv-acesso')
  })
})
//ordenar niv-acesso
router.get('/ordem-niv-accesso/:id', (req, res) => {
  var id1 = req.params.id
  NivAcesso.findOne({ _id: id1 }).then((nivacesso) => {
    if (nivacesso.ordem == 1) {
      nivacesso.ref = nivacesso.ordem
      nivacesso.save()
    }
    if (nivacesso.ordem > 1) {
      var ordem2 = nivacesso.ordem - 1
      nivacesso.ordem = ordem2
      nivacesso.save()
      NivAcesso.findOne({ ref: ordem2 }).then((nivacesso) => {
        nivacesso.ref = nivacesso.ordem + 1
        nivacesso.ordem = nivacesso.ordem + 1
        nivacesso.save()
        NivAcesso.findOne({ _id: id1 }).then((nivacesso) => {
          nivacesso.ref = nivacesso.ordem
          nivacesso.save().then(() => {
            req.flash("success_msg", "Ordem Nível de Acesso editado com sucesso!")
            res.redirect('/admin/niv-acesso')
          }).catch((erro) => {
            req.flash("error_msg", "Error1: Ordem Nível de Acesso não foi editado com sucesso!")
            res.redirect('/admin/niv-acesso')
          })
        }).catch((error) => {
          req.flash("error_msg", "Error1: Ordem Nível de Acesso não foi editado com sucesso!")
          res.redirect('/admin/niv-acesso')
        })
      }).catch((erro) => {
        req.flash("error_msg", "Error2: Ordem Nível de Acesso não foi editado com sucesso!")
        res.redirect('/admin/niv-acesso')
      })
    } else {
      req.flash("error_msg", "Ordem Nível de Acesso não editado com sucesso!")
      res.redirect('/admin/niv-acesso')
    }
    /*
  })
  */
    //res.render("admin/niv-acesso/edit", { nivacesso: nivacesso })
  }).catch((erro) => {
    req.flash("error_msg", "Error: Não é possível carregar o formulário editar Nivel de Acesso!")
    res.redirect('/admin/niv-acesso')
  })
})
//deletar dados db niv-acesso
router.get('/del-niv-acesso/:id', (req, res) => {
  Usuario.findOne({ nivacesso: req.params.id }).then((usuario) => {
    //console.log(usuario.nome)
    if (usuario) {
      req.flash("error_msg", "Error: Nível de Acesso não foi apagado com sucesso! há usuário cadastrado")
      res.redirect("/admin/niv-acesso")
    } else {
      NivAcesso.deleteOne({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Nível de Acesso apagado com sucesso!")
        res.redirect("/admin/niv-acesso")
      }).catch((error) => {
        req.flash("error_msg", "Error: Nível de Acesso não foi apagado com sucesso!")
        res.redirect("/admin/niv-acesso")
      })
    }
    //res.render("admin/niv-acesso/ver", { nivacesso: nivacesso })
  }).catch((erro) => {
    req.flash("error_msg", "Error: Categoria de pagamento não encontrado!")
    res.render("admin/niv-acesso")
  })
})




/** Pagamento **/
router.get('/pagamento', (req, res) => {
  const { page = 1 } = req.query
  Pagamento.paginate({}, { sort: { created: -1 }, populate: 'catpagamento', page: page, limit: 10 }).then((pagamentos) => {
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
  CatPagamento.find().then((catpagamentos) => {
    res.render("admin/pagamento/cad", { catpagamentos: catpagamentos })
  }).catch((error) => {
    req.flash("error_msg", "Error: Categoria Pagamento não encontrado!")
    res.render("admin/pagamento")
  })

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
  if (!req.body.catpagamento || typeof req.body.catpagamento == undefined || req.body.catpagamento == null) {
    errors.push({ error: "Necessário preencher o campo Categoria do Pagamento!" })
  }
  if (errors.length > 0) {
    CatPagamento.find().then((catpagamentos) => {
      res.render("admin/pagamento/cad", { errors: errors, catpagamentos: catpagamentos })
    }).catch((error) => {
      req.flash("erro_msg", "Error: Categoria Pagamento não encontrado")
      res.render("admin/pagamento/cad")
    })
    //res.render("admin/pagamento/cad", { errors: errors })
  } else {
    const addPagamento = {
      nome: req.body.nome,
      valor: req.body.valor.toString().replace(",","."),
      catpagamento: req.body.catpagamento,
    }
    new Pagamento(addPagamento).save().then(() => {
      req.flash("success_msg", "Pagamento cadastrado com sucesso!")
      res.redirect('/admin/pagamento')
    }).catch((erro) => {
      req.flash("error_msg", "Error: Pagamento não foi  cadastrada com sucesso!")
      res.redirect('/admin/pagamento')
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
      pagamento.valor = req.body.valor.toString().replace(",","."),
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
    res.render("admin/cat-pagamento/index", { catpagamentos: catpagamento })
  }).catch((erro) => {
    req.flash("error_msg", "Erro: Categoria de pagamento não encontrado!")
    res.render("admin/cat-pagamento")
  })
})
//visualizar dados cat-pagamento
router.get('/vis-cat-pagamento/:id', (req, res) => {
  CatPagamento.findOne({ _id: req.params.id }).then((catpagamento) => {
    console.log(catpagamento)
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
    res.render("admin/cat-pagamento/edit", { catpagamento: catpagamento })
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
//feito verificação de tabelas estrangeiras
router.get('/del-cat-pagamento/:id', (req, res) => {
  Pagamento.findOne({ catpagamento: req.params.id }).then((pagamento) => {
    if (pagamento) {
      req.flash("error_msg", "Error: Categoria de pagamento não foi apagado, há pagamentos cadastrado com essa categoria!")
      res.redirect("/admin/cat-pagamento")
    } else {
      CatPagamento.deleteOne({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Categoria de pagamento apagado com sucesso!")
        res.redirect("/admin/cat-pagamento")
      }).catch((error) => {
        req.flash("error_msg", "Error: Categoria de pagamento não foi apagado com sucesso!")
        res.redirect("/admin/cat-pagamento")
      })
    }
  }).catch((error) => {
    req.flash("error_msg", "Error: categoria de pagamento não encontrada!")
    res.render("/admin/cat-pagamento")
  })
})



/** Usuario **/
router.get('/usuario', (req, res) => {
  const { page = 1 } = req.query
  Usuario.paginate({}, { sort: { created: -1 }, populate: 'nivacesso', page: page, limit: 10 }).then((usuarios) => {
    //console.log(usuarios)
    res.render("admin/usuario/index", { usuarios: usuarios })
  }).catch((erro) => {
    req.flash("error_msg", "Error: Pagamento não encontrado!")
    res.render("admin/usuario/index")
  })
  /*
  Usuario.find().sort("created").populate("nivacesso").then((usuarios) => {
    res.render("admin/usuario/index", { usuarios: usuarios })
  }).catch((erro) => {
    req.flash("error_msg", "Error: Pagamento não encontrado!")
    res.render("admin/usuario/index")
  })
  */
})
/** Cadastar Usuario */
router.get('/cad-usuario', (req, res) => {
  NivAcesso.find().then((nivacessos) => {
    res.render("admin/usuario/cad", { nivacessos: nivacessos })
  }).catch((error) => {
    req.flash("erro_msg", "Error: Nivel de acesso não encontrado")
    res.render("admin/usuario/cad")
  })
})
/** Add Usuario */
router.post("/add-usuario", (req, res) => {
  var errors = []
  if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
    errors.push({ error: "Necessário preencher o campo nome" })
  }
  if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
    errors.push({ error: "Necessário preencher o campo e-mail" })
  }
  if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
    errors.push({ error: "Necessário preencher o campo senha" })
  }
  if (!req.body.nivacesso || typeof req.body.nivacesso == undefined || req.body.nivacesso == null) {
    errors.push({ error: "Necessário preencher o campo nível de acesso" })
  }
  if (errors.length > 0) {
    NivAcesso.find().then((nivacessos) => {
      res.render("admin/usuario/cad", { errors: errors, nivacessos: nivacessos })
    }).catch((error) => {
      req.flash("erro_msg", "Error: Nivel de acesso não encontrado")
      res.render("admin/usuario/cad")
    })
    //res.render("/admin/cad-usuario", { errors: errors })
  } else {
    const addUsuario = {
      nome: req.body.nome,
      email: req.body.email,
      password: req.body.password,
      nivacesso: req.body.nivacesso
    }
    new Usuario(addUsuario).save().then(() => {
      req.flash("success_msg", "Usuario cadastrado com sucesso!")
      res.redirect('/admin/usuario')
    }).catch((erro) => {
      req.flash("error_msg", "Error: Usuario não foi cadastrado com sucesso")
      res.redirect('/admin/usuario')
    })
  }
})
/** Editar Usuário */
router.get('/edit-usuario/:id', (req, res) => {
  Usuario.findOne({ _id: req.params.id }).populate("nivacesso").then((usuario) => {
    NivAcesso.find().then((nivacessos) => {
      res.render("admin/usuario/edit", { usuario: usuario, nivacessos: nivacessos })
    }).catch((error) => {
    })
    //res.render("admin/usuario/edit", { usuario: usuario})
  }).catch((error) => {
    req.flash("error_msg", "Error: Usuário não encontrada!")
    res.render("/admin/usuario")
  })
})
/** Update Usuário */
router.post('/update-usuario', (req, res) => {
  Usuario.findOne({ _id: req.body.id }).then((usuario) => {
    usuario.nome = req.body.nome,
      usuario.email = req.body.email,
      usuario.nivacesso = req.body.nivacesso
    usuario.save().then(() => {
      req.flash("success_msg", "Usuário editado com sucesso!")
      res.redirect('/admin/usuario')
    }).catch((error) => {
      req.flash("error_msg", "Error: Usuario não foi editado com sucesso")
      res.redirect('/admin/usuario')
    })
  }).catch((error) => {
    req.flash("error_msg", "Error: Usuário não encontrado!")
    res.redirect('/admin/usuario')
  })
})
/** Visualizar Usuário */
router.get('/vis-usuario/:id', (req, res) => {
  Usuario.findOne({ _id: req.params.id }).populate("nivacesso").then((usuario) => {
    res.render("admin/usuario/ver", { usuario: usuario })
  }).catch((erro) => {
    req.flash("error_msg", "Error: Usuário não encontrado!")
    res.render("admin/usuario")
  })
})
/** Deletar Usuário */
router.get('/del-usuario/:id', (req, res) => {
  Usuario.deleteOne({ _id: req.params.id }).then((usuario) => {
    req.flash("success_msg", "Usuário apagado com sucesso!")
    res.redirect("/admin/usuario")
  }).catch((error) => {
    req.flash("error_msg", "Error: Usuário não foi apagado com sucesso!")
    res.redirect("/admin/usuario")
  })
})



module.exports = router