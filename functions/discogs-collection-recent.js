var Discogs = require('disconnect').Client,
  DB,
  USERNAME;

/**
* @param context {WebtaskContext}
*/
module.exports = function(context, cb) {
  // Add this to the Webtask secrets => Settings > Secrets
  var userToken = context.secrets.userToken,
    userUsername = context.secrets.userUsername;

  DB = new Discogs({ userToken: userToken });
  USERNAME = userUsername;
  var result = {
    releases: {} // User's Collection
  };

  getReleases(result)
    .then(function(result) {
      cb(null, result);
    })
    .catch(function(err) {
      cb(err, 'ERROR');
    });
};

// Getters

function getReleases(result) {
  return new Promise(function(resolve, reject) {
    DB.user()
      .collection()
      .getReleases(USERNAME, 0, {
        page: 1,
        per_page: 20,
        sort: 'added',
        sort_order: 'desc'
      })
      .then(function(data) {
        result = processReleases(result, data);
        resolve(result);
      })
      .catch(reject);
  });
}

// Processors

function processReleases(result, data) {
  data.releases.forEach(function(release) {
    result.releases[release.id] = formattedRelease(release);
  });
  return result;
}

// Formatters

function formattedRelease(release) {
  return {
    id: release.id.toString(),
    folderId: release.folder_id.toString(),
    added: new Date(release.date_added).getTime()
  };
}
