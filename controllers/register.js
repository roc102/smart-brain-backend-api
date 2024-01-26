const handleRegister = async (req, res, User, bcrypt) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json("Invalid credentials");
  }

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json("Email is already registered");
    }

    const hashedPassword = bcrypt.hashSync(password);

    // Create a new user instance using the User model
    const newUser = new User({
      email: email,
      name: name,
      password: hashedPassword,
      joined: new Date(),
    });

    // Save the user to the MongoDB database
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(400).json("Unable to register");
  }
};

module.exports = {
  handleRegister: handleRegister,
};
