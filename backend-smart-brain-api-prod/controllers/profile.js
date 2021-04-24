const AccountProfileTable = require('../models/accountProfile/table');

const handleProfileGet = async (req, res) => {
  try {
    console.log(req.body);
    const { userId } = req.body;
    const { accountProfile } = await AccountProfileTable.getAccountProfileById({ id: userId });
    return res.json(accountProfile);
  } catch (err) {
    return res.status(400).json(`Unable to get account Profile: ${err.message}`);
  }
}

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput
  // db('account')
  //   .where({ id })
  //   .update({ name: name, age: age, pet: pet })
  //   .then(resp => {
  //     if (resp) {
  //       res.json("success")
  //     } else {
  //       res.status(400).json('Not found')
  //     }
  //   })
  //   .catch(err => res.status(400).json('error updating user'))
}

module.exports = {
  handleProfileGet,
  handleProfileUpdate
}