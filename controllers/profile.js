const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((users) => {
      if (users.length === 1) {
        res.json(users[0]);
      } else if (users.length === 0) {
        res.status(404).json({ error: "User not found" });
      } else {
        // Log the unexpected situation for debugging
        console.error(
          "Unexpected situation: More than one user found for ID",
          id
        );
        res.status(500).json({ error: "Internal Server Error" });
      }
    })
    .catch((err) => {
      console.error("Error getting user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

module.exports = {
  handleProfileGet,
};
