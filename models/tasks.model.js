const mongoose = require("mongoose");

const task = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            required: true,
        },

        creator: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "User",
          },
    },
    { timestamps: true}
);

const taskModel = mongoose.model("tasks", task);
module.exports = taskModel;