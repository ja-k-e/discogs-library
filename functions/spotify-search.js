var request = require('request'); // "Request" library

module.exports = function(context, cb) {
  // Add these to the Webtask secrets => Settings > Secrets
  var clientId = context.secrets.clientId, // Your Spotify client id
    clientSecret = context.secrets.clientSecret; // Your Spotify secret

  // your application requests authorization
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' + new Buffer(clientId + ':' + clientSecret).toString('base64')
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };
  var type = Object.keys(context.query)[0],
    term = type ? context.query[type] : null;

  if (!type || !term) {
    cb('Supply a param of artist or album', null);
  } else {
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var token = body.access_token;
        var options = {
          url:
            'https://api.spotify.com/v1/search?q=' +
            encodeURIComponent(term) +
            '&type=' +
            type,
          headers: { Authorization: 'Bearer ' + token },
          json: true
        };
        request.get(options, function(error, response, body) {
          cb(null, body);
        });
      } else {
        cb(response, null)
      }
    });
  }
};
