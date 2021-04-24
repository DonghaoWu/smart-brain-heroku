const jwt = require('jsonwebtoken');
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL || 6379, { no_ready_check: true });

const AccountTable = require('../models/account/table');
const AccountProfileTable = require('../models/accountProfile/table');

const handleRegisterPromise = async (req, res, bcrypt) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      throw new Error('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    await AccountTable.storeAccount({ email, hash });
    const { accountProfile } = await AccountProfileTable.storeAccountProfile({ email, name, joined: new Date() });
    return accountProfile;
  } catch (err) {
    throw new Error(err.message);
  }
}

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days' });
}

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, id))
}

const createSession = (accountProfile) => {
  const { email, id } = accountProfile;
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

const registerAuthentication = async (req, res, bcrypt) => {
  try {
    let session;
    const accountProfile = await handleRegisterPromise(req, res, bcrypt);
    if (accountProfile.id && accountProfile.email) session = await createSession({ email: accountProfile.email, id: accountProfile.id });

    return res.json(session);
  } catch (err) {
    console.log(err.message)
    return res.status(400).json(`Unable to register: ${err.message}`);
  }
}

module.exports = {
  registerAuthentication: registerAuthentication
};


