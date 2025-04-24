const User = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a user
const register = async (req, res) => {
    const { password, ...others } = req.body;
    const isUser = await User.findOne({ email: others.email });
    
    // Check if user already exists
    if (isUser) {
        return res
            .status(400)
            .send("user already exists");
    }
    try {
        const user = new User({ ...others, password});
        await user.save();
        res
            .status(201)
            .json({ message: "User created successfully"});
    } catch (error) {
        res.json({ message: "Error creating user", error: error.message });
    }
};


// Login a user
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      	// Find the user by email
      	const user = await User.findOne({ email}).select("+password");
        // Check if user exists
        if (!user) {
            return res.status(400).json({message: "Invalid credentials" });
        }
        
        // Validate the inputted password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({message: "Invalid credentials" });
        }

        // Create a token of the user
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn:"4h" });
        
		// Exclude sensitive fields from the response
        const { password: _, ...userData } = user.toObject();

        return res
        	.cookie("token", token, { httpOnly: true })
        	.status(200)
        	.json({ message: "Login successful", user: userData });

    } catch (error) {
       	res.status(400).json({ message: "Error logging in", error: error.message });
    }
};

// Get the user details and tasks
const getUserProfile = async (req, res) => {
    try {
      	const user = await User.findById(req.user.id).populate("tasks");
	  	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}
	res.status(200).json(user);
} catch (error) {
	res.status(500).json({ message: "Error fetching user profile", error: error.message });
}
  };

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
		 // Ensure the user is authorized to delete the account
		 if (req.user.id !== id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized to delete this user" });
        }
      	const user = await User.findByIdAndDelete(id);
      	if (!user) {
        	return res.status(404).json({ message: "User not found" });
      	}

      	res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      	res.status(400).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    getUserProfile,
    deleteUser
};