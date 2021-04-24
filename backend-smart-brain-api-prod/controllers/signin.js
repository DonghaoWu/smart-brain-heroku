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
    else {
      const { accountProfile } = await AccountProfileTable.getAccountProfileByEmail({ email });
      return accountProfile;
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

const signinAuthentication = async (req, res, bcrypt) => {
  try {
    let session;
    const accountProfile = await noTokenSigninAndGetUser(req, res, bcrypt);
    if (accountProfile.id && accountProfile.email) session = await createSession({ email: accountProfile.email, id: accountProfile.id });

    return res.json(session);

  } catch (err) {
    console.log(err.message)
    return res.status(400).json(`Unable to signin: ${err.message}`);
  }
}

module.exports = {
  signinAuthentication: signinAuthentication
}