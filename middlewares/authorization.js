const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {

  const { token } = req.cookies;
  if (!token) {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this route" });
  }

  jwt.verify(token, "OlalekanTODO", (err, payload) => {
    if (err) {
      return res.status(401).json({ message: "wrong jwt" });
    }
    req.user = payload.id;
    next();
  });
};

module.exports = authorization;