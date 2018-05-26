const express = require('express');
const bodyParser = require('body-parser');
const expressMongoDb = require('express-mongo-db');
const port = process.env.PORT || 3000;
const app = express();
const vo = require('vo');
const ds = require('./data-scrape');
// UNCOMMENT THE DATABASE YOU'D LIKE TO USE
const items = require('../database-mysql');
// const items = require('../database-mongo');

app.use(expressMongoDb('mongodb://localhost/pricedrop'));

// UNCOMMENT FOR REACT
app.use(express.static(__dirname + '/../react-client/dist'));

vo(ds.run)(function(err) {
  console.dir(err);
  console.log('done');
});

// UNCOMMENT FOR ANGULAR
// app.use(express.static(__dirname + '/../angular-client'));
// app.use(express.static(__dirname + '/../node_modules'));

// app.get('/items', function (req, res) {
//   items.selectAll(function(err, data) {
//     if(err) {
//       res.sendStatus(500);
//     } else {
//       res.json(data);
//     }
//   });
// });

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

