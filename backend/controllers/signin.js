const createSession = require('./session');
const AccountTable = require('../models/account/table');
const AccountProfileTable = require('../models/accountProfile/table');

const noTokenSigninAndGetUser = async (req, res, bcrypt) => {
  try {
    const { email, password } = req.body;
    if (!email) throw new Error('Please input your email.');
    if (!password) throw new Error('Please input your password.');

    function validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    if (!validateEmail(email)) {
      throw new Error('Email is not valid.');
    }

    const { hash } = await AccountTable.getAccount({ email });
    const isValid = bcrypt.compareSync(password, hash);

    if (!isValid) {
      throw new Error('Invalid password.')
    }
    else if (isValid) {
      const { accountProfile } = await AccountProfileTable.getAccountProfileByEmail({ email });
      return accountProfile;
    }
  } catch (err) {
    throw err;
  }
}

const signinAuthentication = async (req, res, bcrypt, next) => {
  try {
    let session;
    const accountProfile = await noTokenSigninAndGetUser(req, res, bcrypt);
    if (accountProfile.id && accountProfile.email) {
      session = await createSession({ email: accountProfile.email, id: accountProfile.id });
    }
    return res.status(200).json(session);
  } catch (err) {
    const error = new Error(`Unable to signin: ${err.message}`);
    error.statusCode = 400;

    console.log(error);
    next(error);
  }
}

module.exports = {
  signinAuthentication: signinAuthentication
}