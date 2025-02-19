const express = require("express");
const {
    createUser,
    loginUser,
    showUserProfile,
    deleteUser
} = require("../controllers/user.controller");

const authorization = require("../middlewares/authorization");

const routes = express.Router();

routes.post("/user", createUser);
routes.post("/login", loginUser);
routes.get("/user/myprofile", authorization, showUserProfile);
routes.delete("/user/myprofile/delete", authorization, deleteUser)

module.exports = routes;