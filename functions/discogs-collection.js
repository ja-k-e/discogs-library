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

  // You can test with a limited response by passing full=true
  var full = context.data.full === 'true';

  DB = new Discogs({ userToken: userToken });
  USERNAME = userUsername;
  var result = {
    folders: null, // User's Folders
    releases: {}, // User's Collection
    user: null // User
  };

  getProfile(result)
    .then(function(result) {
      getFolders(result)
        .then(function(result) {
          getReleases(result, full)
            .then(function(result) {
              cb(null, result);
            })
            .catch(function(err) {
              cb(err, 'ERROR');
            });
        })
        .catch(function(err) {
          cb(err, 'ERROR');
        });
    })
    .catch(function(err) {
      cb(err, 'ERROR');
    });
};

// Getters

function getProfile(result) {
  return new Promise(function(resolve, reject) {
    DB.user()
      .getProfile(USERNAME)
      .then(function(data) {
        result.user = processUser(data);
        resolve(result);
      })
      .catch(reject);
  });
}

function getFolders(result) {
  return new Promise(function(resolve, reject) {
    DB.user()
      .collection()
      .getFolders(USERNAME)
      .then(function(data) {
        result.folders = processFolders(data);
        resolve(result);
      })
      .catch(reject);
  });
}

function getReleases(result, full) {
  var perPage = full ? 200 : 1;
  return new Promise(function(resolve, reject) {
    traverseReleases(result, { page: 1, per_page: perPage }, full)
      .then(function(result) {
        resolve(result);
      })
      .catch(reject);
  });
}

// Traversers

function traverseReleases(result, page, full) {
  return new Promise(function(resolve, reject) {
    DB.user()
      .collection()
      .getReleases(USERNAME, 0, page)
      .then(function(data) {
        result = processReleases(result, data);
        if (full)
          if (data.pagination.page < data.pagination.pages) {
            page.page++;
            resolve(traverseReleases(result, page));
          } else resolve(result);
        else resolve(result);
      })
      .catch(reject);
  });
}

// Processors

function processUser(data) {
  return formattedUser(data);
}

function processFolders(data) {
  var folders = {};
  data.folders.forEach(function(folder) {
    folders[folder.id] = formattedFolder(folder);
  });
  return folders;
}

function processReleases(result, data) {
  data.releases.forEach(function(release) {
    result.releases[release.id] = formattedRelease(release);
  });
  return result;
}

// Formatters

function formattedUser(user) {
  return {
    id: user.id.toString(),
    username: user.username,
    registered: new Date(user.registered).getTime(),
    image: user.avatar_url,
    location: user.location,
    collection: user.num_collection
  };
}

function formattedFolder(folder) {
  return {
    id: folder.id.toString(),
    name: folder.name
  };
}

function formattedRelease(release) {
  return {
    id: release.id.toString(),
    folderId: release.folder_id.toString(),
    added: new Date(release.date_added).getTime()
  };
}

function formattedArtists(data) {
  var artists = {};
  data.forEach(function(artist) {
    artists[artist.id] = {
      id: artist.id.toString(),
      name: artist.name.replace(/ \(\d+\)$/, '')
    };
  });
  return artists;
}

function formattedLabels(data) {
  var labels = {};
  data.forEach(function(label) {
    labels[label.id] = {
      id: label.id.toString(),
      name: label.name.replace(/ \(\d+\)$/, ''),
      catno: label.catno,
      type: label.entity_type_name
    };
  });
  return labels;
}

function formattedFormats(format) {
  return {
    quantity: format.qty,
    name: format.name,
    description: format.descriptions ? format.descriptions.join(', ') : ''
  };
}
