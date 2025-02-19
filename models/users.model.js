const mongoose = require("mongoose");

const user = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
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

        tasks: [{
            type: mongoose.Types.ObjectId,
            ref: "tasks"
        }],
    },
    { timestamps: true }
);

const userModel = mongoose.model("User", user);
module.exports = userModel;