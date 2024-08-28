const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users.controllers");
// const checkAuth = require("../middleware/check-auth");

router.get("/", UserController.getExample);
// router.post("/login", UserController.loginUser);

module.exports = router;