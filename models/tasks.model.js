const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        category: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },

        isCompleted: {
            type: Boolean,
            required: true,
            default: false
        },

        deadline: {
            type: Date,
            validate: {
                validator: function (value) {
                    return !isNaN(Date.parse(value)) && value > Date.now();
                },
                message: "Deadline must be a valid future date",
            },
        },

        creator: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },

        priority: { 
            type: String,
            enum: ["Low", "Medium", "High"], 
            default: "Medium",
            required: true,
        },
    },
    { timestamps: true}
);

const categorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },

    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }
});

// Indexes for performance
taskSchema.index({ creator: 1, isCompleted: 1 });

module.exports = mongoose.model("Task", taskSchema);