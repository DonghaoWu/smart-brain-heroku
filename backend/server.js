require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const path = require('path');
const db = require('./dbConnection');
const PORT = process.env.PORT || 5000;

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./middlewares/authorization');

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/auth', auth.requireAuth, (req, res) => { return res.status(200).json('Get auth success.') })
app.post('/signin', (req, res, next) => { signin.signinAuthentication(req, res, bcrypt, next) })
app.post('/register', (req, res, next) => { register.registerAuthentication(req, res, bcrypt, next) })
app.get('/profile', auth.requireAuth, (req, res, next) => { profile.handleProfileGet(req, res, next) })
app.post('/profile', auth.requireAuth, (req, res, next) => { profile.handleProfileUpdate(req, res, next) });
app.put('/image', auth.requireAuth, (req, res, next) => { image.handleImage(req, res, next) })
app.post('/imageurl', auth.requireAuth, (req, res, next) => { image.handleApiCall(req, res, next) });


app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    type: 'error',
    message: err.message
  })
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  })
}

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
})
