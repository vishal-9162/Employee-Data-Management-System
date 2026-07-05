require("dotenv").config();

const { handleRegister } = require("../lib/handlers");

module.exports = async function register(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      status: "error",
      message: "Method not allowed"
    });
  }

  return handleRegister(req, res);
};
