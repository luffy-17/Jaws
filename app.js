// jshint esversion:6
const express  = require('express');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res)=>{
    res.render(__dirname + '/public/index');
});

app.post('/', function(req, res) {
  const tooth = req.body.tooth;
  if (tooth === "upper"){
    res.render(__dirname + '/public/tooth', {file: tooth});
  }
  else{
    res.render(__dirname + '/public/tooth', {file: tooth});
  }
});

app.listen(3000, ()=>{
    console.log('server running on port', 3000);
});
