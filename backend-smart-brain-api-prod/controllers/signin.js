const jwt = require('jsonwebtoken');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL || 6379, { no_ready_check: true });

const AccountTable = require('../models/account/table');
const AccountProfileTable = require('../models/accountProfile/table');

const noTokenSigninAndGetUser = async (req, res, bcrypt) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('incorrect form submission');
    }

    const { hash } = await AccountTable.getAccount({ email });
    const isValid = bcrypt.compareSync(password, hash);

    if (!isValid) {
      throw new Error('wrong credentials!')
    }
    else {
      const { accountProfile } = await AccountProfileTable.getAccountProfileByEmail({ email });
      return accountProfile;
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

const hasTokenAndGetIdFromRedis = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, response) => {
    if (err || !response) {
      return res.status(400).json('Unauthorized.');
    }
    return res.json({ id: response })
  })
}

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '1 days' });
}

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id))
}

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
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

const signinAuthentication = async (req, res, bcrypt) => {
  try {
    let session;
    const { authorization } = req.headers;

    if (authorization) {
      await hasTokenAndGetIdFromRedis(req, res);
    }
    else {
      const accountProfile = await noTokenSigninAndGetUser(req, res, bcrypt);
      if (accountProfile.id && accountProfile.email) session = await createSession({ email: accountProfile.email, id: accountProfile.id });

      return res.json(session);
    }
  } catch (err) {
    console.log(err.message)
    return res.status(400).json(`Unable to signin: ${err.message}`);
  }
}

module.exports = {
  signinAuthentication: signinAuthentication
}