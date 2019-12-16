require('dotenv').config();
import { getAll } from './db/queries/index';
import getSiteData from './data-scrape';
import express from 'express';
import http from 'http';
import path from 'path';

const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const app = express();


/* Authentication 2 ------------------------ */

import passport from 'passport';
import passportJWT from 'passport-jwt';
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
import knex from './db/connection';
// import knex from 'knex';
// const knexDb = knex({ client: 'mysql', connection: process.env.CLEARDB_DATABASE_URL });
// const db = bookshelf(knexDb);
import bookshelf from 'bookshelf';
import securePassword from 'bookshelf-secure-password';
// const securePassword = require('bookshelf-secure-password');
const db = bookshelf(knex);
db.plugin(securePassword);
import jwt from 'jsonwebtoken';

// import flash from 'express-flash';

const User = db.Model.extend({
  tableName: 'login_user',
  hasSecurePassword: true
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET
};

const strategy = new JwtStrategy(opts, (payload, next) => {
  User.forge({ id: payload.id }).fetch().then(res => {
    next(null, res);
  });
});

passport.use(strategy);
app.use(passport.initialize());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/../../react-client/dist/'));

// app.get('/', (req, res) => {
//   res.send('Hello world');
// });

/* Re-activate Heroku Dynos
  The @setInterval callback function below calls the site every 5 minutes
    to keep the dynos active.
  If the site sits idle, the dynos will deactivate and put the site to 
    sleep, and then the scraper won't run.
*/
setInterval(function() {
  http.get("http://pricedropped.herokuapp.com");
}, 300000); // every 5 minutes (300000)

/* ON PAGE LOAD */
/** CREATE GET '/' handler to retrieve price data from db to send to client **/
app.get('/data', async (req, res) => {
  // Query db for All records
  let result = await getAll();
  // Send all records in response
  res.send(result);

});


app.post('/seedUser', (req, res) => {
  console.log("sendUser body: ", req.body);
  if (!req.body.email || !req.body.password) {
    return res.status(401).send('no fields');
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.save().then(() => {
    res.send('ok');
  });
});


app.post('/getToken', (req, res) => {
  // console.log("getToken Request: ", req);
  if (!req.body.email || !req.body.password) {
    return res.status(401).send('no fields');
  }
  User.forge({ email: req.body.email }).fetch().then(result => {
    if (!result) {
      return res.status(400).send('user not found');
    }
  
    result.authenticate(req.body.password).then(user => {

      const payload = { id: user.id };
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
      res.send(token);
    }).catch(err => {
      return res.status(401).send({ err });
    });
  });
});

app.get('/dash', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send('i\'m protected');
});

app.get('/getUser', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send(req.user);
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '/../../react-client/dist/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
});

/* ^^^Authentication */


/* Below, setInterval runs site scraper in intervals a few times a day */
setInterval(getSiteData, 11000000); // 21600000, Every 6 Hours | *15000000 Every 4.16 hours | 300K, Every 5 minutes | 150K, 2.5min 75K 1.25 min
// 2000000 33min


const server = app.listen(port, function() {
  console.log(`listening on port ${port}!`);
});

module.exports = server;