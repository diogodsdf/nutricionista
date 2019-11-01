const express = require("express");

const app = express();

app.get("/", function(req, res){
  res.sendFile(__dirname + "/src/index.html");
});

app.get("/contato", function(req, res){
  res.sendFile(__dirname + "/src/contato.html");
});

app.get("/sobre-empresa", function(req, res){
  res.send("Pagina de Sobre Empresa!");
});

app.get("/blog", function(req, res){
  res.send("Pagina do Blog");
});
app.get("/adm", function(req, res){
  res.send("Pagina do Adm");
});

app.listen(8080);

