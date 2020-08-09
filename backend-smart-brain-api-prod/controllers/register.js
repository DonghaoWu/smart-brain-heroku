const jwt = require('jsonwebtoken');
const redis = require('redis');

// setup Redis:
// const redisClient = redis.createClient();
const redisClient = redis.createClient(process.env.REDIS_URL, {no_ready_check: true});

const handleRegisterPromise = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return Promise.reject('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
  return db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            return Promise.resolve(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => {
      return Promise.reject('unable to register')
    })
}

const signToken = (email) => {
  console.log('inside signTOken')
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
}

const setToken = (token, id) => {
  console.log('inside set token')
  return Promise.resolve(redisClient.set(token, id))
}

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  console.log(token);
  return setToken(token, id)
    .then(() => {
      console.log('ready to send session1')
      return {
        success: 'true',
        userId: id,
        token: token
      }
    })
    .catch(err => {
      return Promise.reject(`creact session failed.`)
    })
}

const registerAuthentication =(req, res,db, bcrypt)=>{
  return handleRegisterPromise(req, res,db, bcrypt)
  .then(data =>{
    return data.id && data.email ? createSession(data) : Promise.reject(data)
  })
  .then(session => {
    console.log('ready to send session2');
    return res.json(session);
  })
  .catch(err => {
    return res.status(400).json(err)
  });
}

module.exports = {
  registerAuthentication: registerAuthentication
};


