const AccountProfileTable = require('../models/accountProfile/table');

const handleProfileGet = async (req, res, next) => {
  console.log('hitting get profile route', req.body)
  try {
    const { userId } = req.body;
    const { accountProfile } = await AccountProfileTable.getAccountProfileById({ id: userId });
    return res.json(accountProfile);
  } catch (err) {
    const error = new Error(`Unable to get profile: ${err.message}`);
    error.statusCode = 400;

    console.log(error);
    next(error);
  }
}

const handleProfileUpdate = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { name, age, pet } = req.body.formInput;
    await AccountProfileTable.updateAccountProfile({ name, age, pet, id: userId });
    return res.status(200).json(`Updated profile success.`);
  } catch (err) {
    const error = new Error(`Update profile failed:${err.message}`);
    error.statusCode = 400;

    console.log(error);
    next(error);
  }
}

module.exports = {
  handleProfileGet,
  handleProfileUpdate
}