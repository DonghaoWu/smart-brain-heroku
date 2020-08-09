require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const path = require('path');
const PORT = process.env.PORT || 4000;

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./middlewares/authorization');

// const db = knex({
//   client: process.env.POSTGRES_CLIENT,
//   connection: {
//     host: process.env.POSTGRES_HOST,
//     user: process.env.POSTGRES_USER,
//     password: process.env.POSTGRES_PASSWORD,
//     database: process.env.POSTGRES_DB
//   }
// });

const pg = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

const app = express();
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

app.post('/signin', (req, res) => { signin.signinAuthentication(req, res, db, bcrypt) })
app.post('/register', (req, res) => { register.registerAuthentication(req, res, db, bcrypt) })
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) })
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) });
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) })

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend-smart-brain-prod/build')));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend-smart-brain-prod/build/index.html'));
  })
}

app.listen(PORT, () => {
  console.log('app is running on port 4000');
})
