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

var appSeqId = 10;
var apiSeqId = 10;

// Accept CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
  next();
});

// api

function findApiIndexById(id) {
  for( var i = 0 ; i < apis.length ; i++) {
    if (parseInt(apis[i].id) === id) {
      return i;
    }
  }
}

app.get('/api', function(req, res) {
  res.json(apis);
});

app.get('/api/random', function(req, res) {
  var id = Math.floor(Math.random() * apis.length);
  var q = apis[id];
  res.json(q);
});

app.get('/api/:id', function(req, res) {
  const result = findApiIndexById(parseInt(req.params.id));
  console.log("Api with index: ", result)
  if (result || result === 0) {
    var q = apis[result];
    res.json(q);
  } else {
    res.statusCode = 404;
    return res.send('Error 404: No api found for id: ' + req.params.id);
  }
});

app.post('/api', function(req, res) {
  console.log("POST: ", req.body);
  if(!req.body.params.hasOwnProperty('name')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  var newApi = {
    id : apiSeqId++,
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

app.patch('/api/:id', function(req, res) {
  console.log("PATCH: ", req.body);
  if(!req.body.params.hasOwnProperty('name')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  const result = findApiIndexById(parseInt(req.params.id));

  console.log("Patch with new api: ", newApi);

  if (result || result === 0) {
    var newApi = {
      id : result,
      name: req.body.params.name,
      technical_name: req.body.params.technical_name,
      context: req.body.params.context,
      version: req.body.params.version,
      visibility: req.body.params.visibility,
      description:req.body.params.description,
      tags:req.body.params.tags,
      api_endpoint:req.body.params.api_endpoint,
      doc_endpoint:req.body.params.doc_endpoint,
      rating:apis[result].rating,
      numberOfUsers:apis[result].numberOfUsers
    };

    apis[result] = newApi;
    res.json(true);
  } else {
    res.statusCode = 404;
    return res.send('Error 404: No api found for id: ' + req.params.id);
  }
});

app.delete('/api/:id', function(req, res) {
  console.log("DELETE: ", req.body);
  const result = findApiIndexById(parseInt(req.params.id));

  if (result || result === 0) {
    apis.splice(result, 1);
    res.json(true);
  } else {
    res.statusCode = 404;
    return res.send('Error 404: No app found for id: ' + req.params.id);
  }
});

// app

function findAppIndexById(id) {
  for( var i = 0 ; i < apps.length ; i++) {
    if (parseInt(apps[i].id) === id) {
      return i;
    }
  }
}

app.get('/app', function(req, res) {
  res.json(apps);
});

app.get('/app/random', function(req, res) {
  var id = Math.floor(Math.random() * apps.length);
  var q = apps[id];
  res.json(q);
});

app.get('/app/:id', function(req, res) {
  const result = findAppIndexById(parseInt(req.params.id));
  console.log("App with index: ", result)
  if (result || result === 0) {
    var q = apps[result];
    res.json(q);
  } else {
    res.statusCode = 404;
    return res.send('Error 404: No app found for id: ' + req.params.id);
  }
});

app.post('/app', function(req, res) {
  console.log("POST: ", req.body);
  if(!req.body.params || !req.body.params.hasOwnProperty('name')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  var newApp = {
    id : appSeqId++,
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
    id : apps[req.params.id],
    name : req.body.params.name,
    description : req.body.params.description,
    callback_url: req.body.params.callback_url
  };

  console.log("Patch with new app: ", newApp);

  const result = findAppIndexById(parseInt(req.params.id));

  if (result || result === 0) {
    apps[result] = newApp;
    res.json(true);
  } else {
    res.statusCode = 404;
    return res.send('Error 404: No app found for id: ' + req.params.id);
  }
});

app.patch('/app/:id', function(req, res) {
  console.log("PATCH: ", req.body);
  if(!req.body.params.hasOwnProperty('name')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  var newApp = {
    id : req.body.params.id,
    name : req.body.params.name,
    description : req.body.params.description,
    callback_url: req.body.params.callback_url
  };

  console.log("Patch with new app: ", newApp);

  const result = findAppIndexById(parseInt(req.params.id));

  if (result || result === 0) {
    apps[result] = newApp;
    res.json(true);
  } else {
    res.statusCode = 404;
    return res.send('Error 404: No app found for id: ' + req.params.id);
  }
});

app.delete('/app/:id', function(req, res) {
  console.log("DELETE: ", req.body);
  const result = findAppIndexById(parseInt(req.params.id));

  if (result || result === 0) {
    apps.splice(result, 1);
    res.json(true);
  } else {
    res.statusCode = 404;
    return res.send('Error 404: No app found for id: ' + req.params.id);
  }
});

// Subscription

app.listen(process.env.PORT || 3100);
