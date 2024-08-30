const express = require("express");
const router = express.Router();

const OauthController = require("../controllers/Oauth.controllers");
// const checkAuth = require("../middleware/check-auth");

router.get("/HandShake", OauthController.OauthHandShake);
router.get("/Token-Callback", OauthController.TokenCallback);
router.post("/detach-session", OauthController.detachSession);
router.get("/userdetails", OauthController.userDetails);



module.exports = router;