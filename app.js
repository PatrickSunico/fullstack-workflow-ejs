var express = require('express');
var ejs = require('ejs');
var app = express();

var port = Number(process.env.PORT || 3000);

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.static('public/views'));


app.get('/', function(req,res){
  res.render('../public/views/index');
});

app.listen(port, function(){
  console.log('Server Started');
});
