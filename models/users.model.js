const mongoose = require("mongoose");



const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique:true,
        },

        email: { 
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

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