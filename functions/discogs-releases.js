var Discogs = require('disconnect').Client,
  DB;

/**
* @param context {WebtaskContext}
*/
module.exports = function(context, cb) {
  // Add this to the Webtask secrets => Settings > Secrets
  var userToken = context.secrets.userToken;

  DB = new Discogs({ userToken: userToken });
  var ids = context.data.ids;
  if (!ids) cb('No Ids', null);

  ids = ids.split(',');
  if (ids.length > 60) cb('< 60 ids at a time', null);

  var result = {};
  getReleases(result, ids)
    .then(function(result) {
      cb(null, result);
    })
    .catch(function(err) {
      cb(err, 'ERROR');
    });
};

// Getters

function getReleases(result, ids) {
  return new Promise(function(resolve, reject) {
    var localIds = [];
    ids.forEach(function(id) {
      DB.database()
        .getRelease(id)
        .then(function(data) {
          localIds.push(data.id);
          result = processRelease(result, data);
          if (localIds.length >= ids.length) resolve(result);
        })
        .catch(reject);
    });
  });
}

// Processors

function processRelease(result, data) {
  result[data.id] = formattedRelease(data);
  return result;
}

// Formatters

function formattedRelease(release) {
  return {
    id: release.id.toString(),
    title: release.title,
    tracklist: formattedTracklist(release.tracklist),
    artists: formattedArtists(release.artists),
    labels: formattedLabels(release.labels),
    companies: formattedLabels(release.companies),
    formats: release.formats.map(formattedFormats),
    year: release.year,
    images: formattedImages(release.images)
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

function formattedImages(images) {
  if (!images) return {};
  return images.map(function(image) {
    return {
      uri: image.uri,
      height: image.height,
      width: image.width
    };
  });
}

function formattedTracklist(tracklist) {
  if (!tracklist) return {};
  return tracklist.map(function(track) {
    return {
      position: track.position,
      title: track.title,
      type: track.type_
    };
  });
}

function formattedLabels(data) {
  if (!data) return {};
  var labels = {};
  data.forEach(function(label) {
    var object = {
      id: label.id.toString(),
      name: label.name.replace(/ \(\d+\)$/, ''),
      type: label.entity_type_name
    };
    if (object.type === 'Label') object.catno = label.catno;
    labels[label.id] = object;
  });
  return labels;
}

function formattedFormats(format) {
  if (!format) return {};
  return {
    quantity: format.qty,
    name: format.name,
    description: format.descriptions ? format.descriptions.join(', ') : ''
  };
}
