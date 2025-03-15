const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String
        },

        category: { 
            type: String,
            default: "General"
        },

        IsCompleted: {
            type: Boolean,
            required: true,
            default: false
        },

        deadline: {
            type: Date
        },

        creator: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
          },
    },
    { timestamps: true}
);


module.exports = mongoose.model("Task", taskSchema);