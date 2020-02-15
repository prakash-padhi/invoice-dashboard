const config = require("config");

module.exports = function(req, res, next) {
  // Get token form header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = config.get("slackSecret");
    if (decoded != token) {
      res.status(401).json({ msg: "Token is not valid" });
    } else {
      next();
    }
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
