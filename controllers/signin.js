const handleSignin = (User, bcrypt) => async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Invalid credentials");
  }

  try {
    // Find user by email in MongoDB using the User model
    const user = await User.findOne({ email });

    if (user) {
      // Compare the password using bcrypt
      const isValid = bcrypt.compareSync(password, user.password);

      if (isValid) {
        // Customize the user object to be sent in the response
        const { _id, name, email, entries, joined } = user;
        const userData = { _id, name, email, entries, joined };

        return res.json(userData);
      } else {
        return res.status(400).json("Invalid credentials");
      }
    } else {
      return res.status(400).json("Wrong credentials");
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json("Error signing in");
  }
};

module.exports = {
  handleSignin: handleSignin,
};
