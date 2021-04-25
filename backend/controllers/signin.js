const createSession = require('./session');
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