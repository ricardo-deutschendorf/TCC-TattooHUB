var express = require('express');
var app = express();

app.get('/',function(req,res){
    res.send("");
});

app.listen(8080,function(){
    console.log("Servidor Escutando na porta 8080");
});