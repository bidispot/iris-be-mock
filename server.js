var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const apis = JSON.parse(fs.readFileSync('./apis.json', 'utf8'));
const apps =  JSON.parse(fs.readFileSync('./apps.json', 'utf8'));

// Accept CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
  next();
});

// api

app.get('/api', function(req, res) {
  res.json(apis);
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
  console.log("POST: ", req.body);
  if(!req.body.params.hasOwnProperty('name')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  var newApi = {
    id : apis.length,
    name: req.body.params.name,
    technical_name: req.body.params.technical_name,
    context: req.body.params.context,
    version: req.body.params.version,
    visibility: req.body.params.visibility,
    description:req.body.params.description,
    tags:req.body.params.tags,
    api_endpoint:req.body.params.api_endpoint,
    doc_endpoint:req.body.params.doc_endpoint
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

// app

app.get('/app', function(req, res) {
  res.json(apps);
});

app.get('/app/random', function(req, res) {
  var id = Math.floor(Math.random() * apps.length);
  var q = apps[id];
  res.json(q);
});

app.get('/app/:id', function(req, res) {
  if(apps.length <= req.params.id || req.params.id < 0) {
    res.statusCode = 404;
    return res.send('Error 404: No app found');
  }

  var q = apps[req.params.id];
  res.json(q);
});

app.post('/app', function(req, res) {
  console.log("POST: ", req.body);
  if(!req.body.params.hasOwnProperty('name')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  var newApp = {
    id : apps.length,
    name : req.body.params.name,
    description : req.body.params.description,
    callback_url: req.body.params.callback_url
  };

  apps.push(newApp);
  res.json(true);
});

app.put('/app/:id', function(req, res) {
  console.log("UPDATE: ", req.body);
  if(!req.body.params.hasOwnProperty('name')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  var newApp = {
    id : apps.length,
    name : req.body.params.name,
    description : req.body.params.description,
    callback_url: req.body.params.callback_url
  };

  apps[eq.params.id] = newApp;

  res.json(true);
});

app.patch('/app/:id', function(req, res) {
  console.log("PATCH: ", req.body);
  if(!req.body.params.hasOwnProperty('id') || req.body.params.hasOwnProperty('id') === '') {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect: id is undefined or empty');
  }

  apps[req.params.id].name=req.body.params.name;
  apps[req.params.id].description=req.body.params.description;
  apps[req.params.id].callback_url=req.body.params.callback_url;

  res.json(true);
});

app.delete('/app/:id', function(req, res) {
  console.log("DELETE: ", req.body);
  if(apps.length <= req.params.id) {
    res.statusCode = 404;
    return res.send('Error 404: No app found');
  }

  apps.splice(req.params.id, 1);
  res.json(true);
});

// Subscription

app.listen(process.env.PORT || 3100);
