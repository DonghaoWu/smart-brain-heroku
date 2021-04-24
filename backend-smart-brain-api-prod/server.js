require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const db = require('./dbConnection');
const PORT = process.env.PORT || 4000;

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./middlewares/authorization');

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/auth', auth.requireAuth, (req, res, next) => { return res.status(200).json('success') })
app.post('/signin', (req, res, next) => { signin.signinAuthentication(req, res, bcrypt, next) })
app.post('/register', (req, res, next) => { register.registerAuthentication(req, res, bcrypt, next) })
app.get('/profile', auth.requireAuth, (req, res, next) => { profile.handleProfileGet(req, res, next) })
app.post('/profile', auth.requireAuth, (req, res, next) => { profile.handleProfileUpdate(req, res, next) });
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) });

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    type: 'error',
    message: err.message
  })
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend-smart-brain-prod/build')));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend-smart-brain-prod/build/index.html'));
  })
}

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
})
