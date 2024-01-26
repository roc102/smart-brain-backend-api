const bodyParser = require("body-parser");
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const mongoose = require("mongoose");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

// security checkups
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
// const expressSanitizer = require('express-mongo-sanitize');
// const { checkSchema, validationResult } = require('express-validator');

const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("DB Connected");
});

// User schema and model
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  entries: { type: Number, default: 0 },
  joined: Date,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.status(200).json(`It's working`);
});

app.post("/signin", signin.handleSignin(User, bcrypt));
app.post("/register", (req, res) => {
  register.handleRegister(req, res, User, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, User);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, User);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res, User);
});

app.delete("/deleteuser/:id", (req, res) => {
  const { id } = req.params;

  // Delete user from MongoDB using the User model
  User.findByIdAndDelete(id)
    .then((result) => {
      if (result) {
        res.status(200).json("User deleted successfully");
      } else {
        res.status(404).json("User not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json("Error deleting user");
    });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Internal Server Error' });
// });

app.listen(process.env.PORT || 8080, () => {
  console.log(`App is running on port ${process.env.PORT || 8080}`);
});
