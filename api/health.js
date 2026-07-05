require("dotenv").config();

const { handleHealth } = require("../lib/handlers");

module.exports = function health(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      status: "error",
      message: "Method not allowed"
    });
  }

  return handleHealth(req, res);
};
