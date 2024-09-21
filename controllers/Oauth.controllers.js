const OauthController = {};
const axios = require("axios");
// const userModel = require("../modeks")
const {
  storeUserInDB,deleteUserFromDB
} = require("./../helpers/Oauth.helper");

OauthController.OauthHandShake = async (req, res) => {
  try {
    res.send({
      authUrl: `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=repo read:org user`,
    });
  } catch (error) {
    console.log(error, "HandShake error");
  }
};
OauthController.TokenCallback = async (req, res) => {
  let code = req.query.accessCode;
  try {
    const body = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    };
    const opts = { headers: { accept: "application/json" } };
    axios
      .post("https://github.com/login/oauth/access_token", body, opts)
      .then((_res) => _res.data.access_token)
      .then((token) => {
        // if (token) {
        //   req.session.token = token;
        // }
        res.status(200).json({ accessToken: token });
      });
  } catch (error) {
    console.log(error, "HandShake error");
  }
};
OauthController.userDetails = async (req, res) => {
    let token = req.query.token;
    try {
        const { data } = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        res.cookie("login", data.login, { httpOnly: true });
        const user = await storeUserInDB(data,token);
        res.status(200).json(user);

    } catch (err) {
        console.error('Error fetching user from GitHub', err);
        throw err;
    } 
};
OauthController.detachSession = async (req, res) => {
  let token = req.body.accessToken;
  let githubId = req.body.githubId;
  try {
    axios({
      method: "delete",
      url: `https://api.github.com/applications/${process.env.CLIENT_ID}/grant`,
      auth: {
        username: process.env.CLIENT_ID,
        password: process.env.CLIENT_SECRET,
      },
      data: {
        access_token:  `${token}`,
      },
    })
      .then(async (resp) => {
        console.log("token is destroyed");
        const user = await deleteUserFromDB(githubId);
        console.log(user,'successful');
        res.status(200).json({status:200,message:'session Ended'});


      })
      .catch((err) => {
        console.error("Failed to revoke GitHub token:", err);
        res.status(200).json({status:err.status,message:'Session End Failed'})
      });
  } catch (error) {
    console.log(error, "HandShake error");
  }
};
OauthController.fetchAllOrganizations = async (req, res) =>{
  try {
    const token = req.headers.authorization; // Assuming token is passed in header
    const orgsResponse = await axios.get('https://api.github.com/user/orgs', {
      headers: { "Authorization": `${token}`,
      "Accept": "application/vnd.github+json",
       "X-GitHub-Api-Version": "2022-11-28" }
    });
    res.json(orgsResponse.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

// Fetch repositories for a specific organization
OauthController.fetchAllOrganizationsRepos = async (req, res) =>{
  try {
    const token = req.headers.authorization;
    const org = req.params.org;
    const reposResponse = await axios.get(`https://api.github.com/orgs/${org}/repos`, {
      headers: { "Authorization": `${token}`,
      "Accept": "application/vnd.github+json",
       "X-GitHub-Api-Version": "2022-11-28" }
    });
    res.json(reposResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = OauthController;
