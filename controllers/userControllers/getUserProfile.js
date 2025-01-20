const getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password"); // Excluir el campo password
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user profile" });
    }
  };
module.exports = {  getUserProfile };
