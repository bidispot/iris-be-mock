var express = require('express');
var app = express();
var fs = require("fs");

const fileName = './apis.json';

app.use(express.bodyParser());

// Accept CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api', function(req, res) {
  var data =  fs.readFileSync(fileName, 'utf8');
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(data);
  res.end();
});

app.get('/api/random', function(req, res) {
  var id = Math.floor(Math.random() * apis.length);
  var q = apis[id];
  res.json(q);
});

app.get('/api/:id', function(req, res) {
  if(apis.length <= req.params.id || req.params.id < 0) {
    res.statusCode = 404;
    return res.send('Error 404: No api found');
  }

  var q = apis[req.params.id];
  res.json(q);
});

app.post('/api', function(req, res) {
  if(!req.body.hasOwnProperty('name')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  var newApi = {
    name : req.body.name
  };

  apis.push(newApi);
  res.json(true);
});

app.delete('/api/:id', function(req, res) {
  if(apis.length <= req.params.id) {
    res.statusCode = 404;
    return res.send('Error 404: No api found');
  }

  apis.splice(req.params.id, 1);
  res.json(true);
});

app.listen(process.env.PORT || 3100);
