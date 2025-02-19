const userModel = require("../models/users.model");
const taskModel = require("../models/tasks.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
    const { password, ...others } = req.body;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const isUser = await userModel.findOne({ email: others.email });
    if (isUser) {
        return res
            .status(400)
            .send("user already exists");
    }
    try {
        const newUser = new userModel({ ...others, password: hashedPassword });
        await newUser.save();
        res
            .status(201)
            .send("user created successfully")
    } catch (error) {
        res.send(error);
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(404)
            .json({message: "Check the provided credentials and try again."});
    }

    const checkUser = await userModel.findOne({ email });
    if (!checkUser) {
        return res
            .status(401)
            .json({message: "Seems like you haven't signed up yet, sign up now"})
    }

    const comfirmPassword = bcrypt.compareSync(password, checkUser.password);
    if (!comfirmPassword) {
        return res
            .status(401)
            .json({message: "Wrong password, try again."});
    }

    // creating a jwt token

    const token = jwt.sign({id: checkUser.id}, process.env.JWT_PASSWORD);
    return res
        .cookie("token", token, { httpOnly: true })
        .status(200)
        .json(checkUser);
};

const showUserProfile = async (req, res) => {
    const user = req.user;
    try {
      const oneUser = await userModel.findById(user).populate("tasks");
      res.json(oneUser);
    } catch (error) {
      res.send("something went wrong");
    }
  };

const deleteUser = async (req, res) => {
    const user = req.user;
    try {
        const oneUser = await userModel.findByIdAndDelete(user);
        res.json("Your profile has been deleted");
      } catch (error) {
        res.send("something went wrong");
      }
};

module.exports = {
    createUser,
    loginUser,
    showUserProfile,
    deleteUser
};