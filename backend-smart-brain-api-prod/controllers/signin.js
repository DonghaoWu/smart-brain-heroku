const jwt = require('jsonwebtoken');
const redis = require('redis');

// setup Redis:
// const redisClient = redis.createClient();
const redisClient = redis.createClient(process.env.REDIS_URL, { no_ready_check: true });


const noTokenSigninAndGetUser = (req, res, db, bcrypt) => {
  console.log('hit signin route in backend');
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            return Promise.resolve(user[0]);
          })
          .catch(err => Promise.reject('unable to get user'))
      } else {
        return Promise.reject('wrong credentials (wrong password)')
      }
    })
    .catch(err => Promise.reject('wrong credentials (wrong email)'))
}

const hasTokenAndGetIdFromRedis = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized.');
    }
    return res.json({ id: reply })
  })
}

const signToken = (email) => {
  console.log('hit here in generate token by jwt');
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
}

const setToken = (token, id) => {
  console.log('hit here in storing token in redis');
  return Promise.resolve(redisClient.set(token, id))
}

const createSession = (user) => {
  console.log('hit here in createSession');
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      console.log('generate token success', token)
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

const signinAuthentication = (req, res, db, bcrypt) => {
  const { authorization } = req.headers;
  return authorization ? hasTokenAndGetIdFromRedis(req, res)
    : noTokenSigninAndGetUser(req, res, db, bcrypt)
      .then(data => {
        console.log('generate data', data);
        return data.id && data.email ? createSession(data) : Promise.reject(data)
      })
      .then(session => {
        console.log('generate session', session);
        return res.json(session);
      })
      .catch(err => {
        console.log(err)
        return res.status(400).json(err)
      });
}

module.exports = {
  signinAuthentication: signinAuthentication
}