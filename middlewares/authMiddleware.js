const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Authentication token missing",
      });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    req.body.userId = decodedToken.userId;

    next();
  } catch (err) {
    res.status(403).send({
      success: false,
      message: err.message,
    });
  }
};
