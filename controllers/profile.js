const handleProfileGet = (req, res, User) => {
  const { id } = req.params;

  User.findById(id, { _id: 1, name: 1, email: 1 })
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch(err => {
      console.error("Error getting user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

module.exports = {
  handleProfileGet,
};


// const handleProfileGet = (req, res, User) => {
//   const { id } = req.params;

//   User.findById(id)
//     .then(user => {
//       if (user) {
//         res.json(user);
//       } else {
//         res.status(404).json({ error: "User not found" });
//       }
//     })
//     .catch(err => {
//       console.error("Error getting user:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//     });
// };

// module.exports = {
//   handleProfileGet,
// };

