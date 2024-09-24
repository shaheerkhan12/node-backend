const User = require("./../models/user.model")

async function storeUserInDB(userRecord,token) {
    const githubUser = userRecord;
    const loginTime = new Date();
    console.log(loginTime);
    let user = await User.findOne({ githubId: githubUser.id });

    if (!user) {
        user = new User({
            githubId: githubUser.id,
            username: githubUser.login,
            email: githubUser.email,
            avatarUrl: githubUser.avatar_url,
            loginTime: loginTime,
            syncType: 'full',
            lastSyncTime: loginTime,
            accessToken: token
        });
    } else {
        user.accessToken = token;
        user.syncType = determineSyncType(user.lastSyncTime);
        user.loginTime = loginTime;
        user.lastSyncTime = loginTime;
    }

    await user.save();
    return user;
}
async function deleteUserFromDB(githubId) {
    try {
        const result = await User.deleteOne({ githubId: githubId });

        if (result.deletedCount === 1) {
          return true;
        } else {
        return false;
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

function determineSyncType(lastSyncTime) {
    if (!lastSyncTime) {
        return 'full';
    } else {
        const timeSinceLastSync = new Date() - new Date(lastSyncTime);
        return timeSinceLastSync > 24 * 60 * 60 * 1000 ? 'full' : 'incremental';
    }
}
function processUserContributions(contributions, userStatsMap, type) {
    for (const contribution of contributions) {
      const userId = contribution.author?.id || contribution.user?.id;
      const userLogin = contribution.author?.login || contribution.user?.login;
  
      if (!userId) continue;
  
      if (!userStatsMap[userId]) {
        userStatsMap[userId] = {
          userId,
          userLogin,
          totalCommits: 0,
          totalPullRequests: 0,
          totalIssues: 0,
        };
      }
  
      switch (type) {
        case 'commit':
          userStatsMap[userId].totalCommits += 1;
          break;
        case 'pullRequest':
          userStatsMap[userId].totalPullRequests += 1;
          break;
        case 'issue':
          userStatsMap[userId].totalIssues += 1;
          break;
      }
    }
}

module.exports = {  storeUserInDB,deleteUserFromDB ,processUserContributions};
