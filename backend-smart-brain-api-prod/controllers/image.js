const Clarifai = require('clarifai');
const AccountProfileTable = require('../models/accountProfile/table');

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
  apiKey: process.env.API_KEY
});

const handleApiCall = async (req, res, next) => {
  try {
    const apiData = await app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input);
    return res.json(apiData);
  } catch (err) {
    const error = new Error(`Unable to call the external API: ${err.message}`);
    error.statusCode = 400;

    console.log(error);
    next(error);
  }
}

const handleImage = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const data = await AccountProfileTable.addImageNumAccountProfile({ id: userId });
    
    return res.status(200).json(data.imageNum);
  } catch (err) {
    const error = new Error(`Unable to get imageNum:${err.message}`);
    error.statusCode = 400;

    console.log(error);
    next(error);
  }
}

module.exports = {
  handleImage,
  handleApiCall
}