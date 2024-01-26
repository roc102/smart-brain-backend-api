const Clarifai = require("clarifai");
require("dotenv").config();

const app = new Clarifai.App({
  apiKey: process.env.API_KEY,
});

const handleApiCall = (req, res, User) => {
  const { id, input } = req.body;

  User.findById(id)
    .then((user) => {
      if (user) {
        app.models
          .predict("face-detection", input)
          .then((data) => {
            res.json(data);
          })
          .catch((err) => res.status(400).json("Unable to work with API"));
      } else {
        res.status(404).json("User not found");
      }
    })
    .catch((err) => res.status(500).json("Error finding user"));
};

const handleImage = (req, res, User) => {
  const { id } = req.body;

  User.findByIdAndUpdate(id, { $inc: { entries: 1 } }, { new: true })
    .then((user) => {
      if (user) {
        res.json(user.entries);
      } else {
        res.status(404).json("User not found");
      }
    })
    .catch((err) => res.status(500).json("Error updating entries"));
};

module.exports = {
  handleImage,
  handleApiCall,
};
