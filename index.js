const express = require("express");
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();


const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log("connected to database")
    })
    .catch(() => {
        console.log("something went wrong")
    });

app.use(userRoutes);


app.listen(PORT, () => {
    console.log('app is running');
});


