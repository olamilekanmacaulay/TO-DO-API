const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Task = require("./tasks.model"); // Task model

// Define the User schema
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: [true, "Username is required"], 
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },

    email: { 
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },

    password: { 
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },
},
    { timestamps: true }
);

// Pre-save middleware to hash the password before saving the user.
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next(); // Skip if the password is not modified

    try {
        // Hash the password
        this.password = await bcrypt.hash(this.password, 10);
        return next();
    } catch (error) {
        return next(error);
    }
});

// Pre-save middleware to hash the password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.post("findOneAndDelete", async function (user) {
    if (user) {
      // Delete all tasks created by the user
      await Task.deleteMany({ creator: user._id });
  
      console.log(`User ${user.username} and their associated data have been deleted.`);
    }
  });


module.exports = mongoose.model("User", userSchema);