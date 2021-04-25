const createSession = require('./session');
const AccountTable = require('../models/account/table');
const AccountProfileTable = require('../models/accountProfile/table');

const handleRegisterPromise = async (req, res, bcrypt) => {
  try {
    const { email, name, password } = req.body;
    if (!name) {
      throw new Error('Please input your name.');
    }
    if (!email) {
      throw new Error('Please input your email.');
    }
    if (!password) {
      throw new Error('Please input your password.');
    }
    
    const hash = bcrypt.hashSync(password);
    await AccountTable.storeAccount({ email, hash });
    const { accountProfile } = await AccountProfileTable.storeAccountProfile({ email, name, joined: new Date() });
    return accountProfile;
  } catch (err) {
    throw err;
  }
}

const registerAuthentication = async (req, res, bcrypt, next) => {
  try {
    let session;
    const accountProfile = await handleRegisterPromise(req, res, bcrypt);

    if (accountProfile.id && accountProfile.email) {
      session = await createSession({ email: accountProfile.email, id: accountProfile.id });
    }
    return res.status(200).json(session);
  } catch (err) {
    const error = new Error(`Unable to register: ${err.message}`);
    error.statusCode = 400;

    console.log(error);
    next(error);
  }
}

module.exports = {
  registerAuthentication: registerAuthentication
};


