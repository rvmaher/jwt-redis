const express = require("express");
const {
  register,
  login,
  logout,
  refreshToken,
} = require("../controller/auth.controller");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);
router.post("/refresh-token", refreshToken);

module.exports = router;
