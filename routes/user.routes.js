const express = require("express");
const {
    register,
    login,
    getUserProfile,
    deleteUser
} = require("../controllers/user.controller");

const authorization = require("../middlewares/authorization");

const routes = express.Router();

routes.post("/register", register);
routes.post("/login", login);
routes.get("/user/myprofile", authorization, getUserProfile);
routes.delete("/user/myprofile/delete", authorization, deleteUser)

module.exports = routes;