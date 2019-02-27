const express = require('express');
const session = require('express-session');
const massive = require('massive')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express();

const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

app.use(bodyParser.json());
app.use( session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 100000000
  }
}))

massive(CONNECTION_STRING).then( db => {
  app.set('db', db)
  console.log('connected to db')
  app.listen(SERVER_PORT, () => {console.log(`Bingpot on ${SERVER_PORT}`)})
})

//CONTROLLERS
const authCtrl = require('./controllers/authController')


//ENDPOINTS
app.post(`/auth/register`, authCtrl.register);
app.post(`/auth/login`, authCtrl.login);
app.get(`/auth/logout`, authCtrl.logout)