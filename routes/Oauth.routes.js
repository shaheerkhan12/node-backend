const express = require("express");
const router = express.Router();

const OauthController = require("../controllers/Oauth.controllers");
// const checkAuth = require("../middleware/check-auth");

router.get("/HandShake", OauthController.OauthHandShake);
router.get("/Token-Callback", OauthController.TokenCallback);
router.post("/detach-session", OauthController.detachSession);
router.get("/userdetails", OauthController.userDetails);

router.get("/gitOrgans", OauthController.fetchAllOrganizations);
router.post("/gitOrgans/repos", OauthController.fetchAllOrganizationsRepos);
router.post("/gitOrgans/repo", OauthController.fetchAllOrganizationsReposDataStats)

module.exports = router;