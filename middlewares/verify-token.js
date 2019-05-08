const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.body.token || req.query.token;
  if (token) {
    jwt.verify(token, req.app.get("API_JWT_KEY"), (error, decoded) => {
      if (error) {
        res.json({
          status: false,
          message: "Wrong token"
        });
      } else {
        req.decode = decoded;
        next();
      }
    });
  } else {
    res.json({
      status: false,
      message: "Token has not been given"
    });
  }
};
