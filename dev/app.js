/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Adapter = function () {
  function Adapter() {
    _classCallCheck(this, Adapter);
  }

  _createClass(Adapter, [{
    key: "initialize",
    value: function initialize(database) {
      this.database = database;
    }
  }, {
    key: "documents",
    value: function documents(querySnapshot) {
      var response = {};
      querySnapshot.forEach(function (doc) {
        response[doc.id] = doc.data();
      });
      return response;
    }
  }]);

  return Adapter;
}();

exports.default = Adapter;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var //
discogsCollection = 'https://wt-3cbd5efe1e55015be8738859f4791dfe-0.run.webtask.io/discogs-collection',
    discogsReleases = 'https://wt-3cbd5efe1e55015be8738859f4791dfe-0.run.webtask.io/discogs-releases',
    spotifySearch = 'https://wt-3cbd5efe1e55015be8738859f4791dfe-0.run.webtask.io/spotify-search';

var Webtask = function () {
  function Webtask() {
    _classCallCheck(this, Webtask);
  }

  _createClass(Webtask, [{
    key: 'searchSpotify',
    value: function searchSpotify(artist, album) {
      return new Promise(function (resolve, reject) {
        var query = album + ' artist:' + artist;
        axios.get(spotifySearch, { params: { album: query } }).then(function (data) {
          resolve(data);
        }).catch(reject);
      });
    }
  }, {
    key: 'getCollection',
    value: function getCollection() {
      return new Promise(function (resolve, reject) {
        axios.get(discogsCollection, { params: { full: true } }).then(resolve).catch(reject);
      });
    }
  }, {
    key: 'getReleases',
    value: function getReleases(idsString) {
      return new Promise(function (resolve, reject) {
        axios.get(discogsReleases, { params: { ids: idsString } }).then(resolve).catch(reject);
      });
    }
  }]);

  return Webtask;
}();

exports.default = Webtask;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _DB = __webpack_require__(3);

var _DB2 = _interopRequireDefault(_DB);

var _App = __webpack_require__(5);

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VERSION = '0.1';

console.info('\n%cDiscogs Library v' + VERSION + '\n%c\xA9 Jake Albaugh ' + new Date().getFullYear() + '\nhttps://twitter.com/jake_albaugh\nhttps://github.com/jakealbaugh/discogs-library\n\n', 'font-family: sans-serif; font-weight: bold;', 'font-family: sans-serif; font-weight: normal;');

var //
db = new _DB2.default(),
    database = db.database;

if (!!window.location.search.match(/\?authorize=true/)) db.authorize(function (data) {
  return new _App2.default({ database: database, visitor: data });
});else db.authorizeWithoutSignin(function (data) {
  return new _App2.default({ database: database, visitor: data });
}, function () {
  return new _App2.default({ database: null, visitor: { guest: true, email: 'NOPE' } });
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var firebaseKeys = __webpack_require__(4);

var DB = function () {
  function DB() {
    _classCallCheck(this, DB);

    this.app = firebase.initializeApp(firebaseKeys);
    this.database = firebase.firestore(this.app);
    this.authorized = false;
  }

  _createClass(DB, [{
    key: 'authorize',
    value: function authorize(callback) {
      var _this = this;

      this._authorized().then(function (data) {
        _this.authorized = true;
        callback(data);
      }).catch(this._authorize.bind(this));
    }
  }, {
    key: 'authorizeWithoutSignin',
    value: function authorizeWithoutSignin(success, error) {
      var _this2 = this;

      this._authorized().then(function (data) {
        _this2.authorized = true;
        success(data);
      }).catch(function () {
        return error();
      });
    }
  }, {
    key: 'signOut',
    value: function signOut() {
      return new Promise(function (resolve, reject) {
        firebase.auth().signOut().then(resolve).catch(reject);
      });
    }
  }, {
    key: '_authorized',
    value: function _authorized() {
      return new Promise(function (resolve, reject) {
        firebase.auth().onAuthStateChanged(function (existingUser) {
          if (existingUser) resolve(existingUser);else reject();
        });
      });
    }
  }, {
    key: '_authorize',
    value: function _authorize() {
      if (this.authorized) return;
      firebase.auth().getRedirectResult().then(function (result) {
        console.log('redirectresult', result.user);
      });
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      firebase.auth().signInWithRedirect(provider);
    }
  }]);

  return DB;
}();

exports.default = DB;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  apiKey: 'AIzaSyBBtdbeibfjdKWQLPoPSqWJcU2eMikRihA',
  authDomain: 'discogs-library.firebaseapp.com',
  databaseURL: 'https://discogs-library.firebaseio.com',
  projectId: 'discogs-library',
  storageBucket: 'discogs-library.appspot.com',
  messagingSenderId: '1050557972233'
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Store = __webpack_require__(6);

var _Store2 = _interopRequireDefault(_Store);

var _Webtask = __webpack_require__(1);

var _Webtask2 = _interopRequireDefault(_Webtask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MASTER_EMAIL = 'jake.albaugh@gmail.com';

var App = function () {
  function App(_ref) {
    var database = _ref.database,
        visitor = _ref.visitor;

    _classCallCheck(this, App);

    this.visitor = this._formattedVisitor(visitor);
    this.masterUser = this.visitor.email === MASTER_EMAIL;
    this.store = new _Store2.default(database, this);
    this.initialize();
  }

  _createClass(App, [{
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      // this.testLoadingMessages();
      if (this.masterUser) {
        var localData = this.store.loadAllDataFromLocalStorage();
        if (localData) {
          console.info('Data Loaded from localStorage');
          this.loadMissingReleasesOrProcess();
        } else {
          this.store.getAllDataFromFirebase().then(function () {
            console.info('Data Loaded from Firestore');
            _this.loadMissingReleasesOrProcess();
          }).catch(this.handleError.bind(this));
        }
      } else {
        this.store.loadAllDataFromJSON().then(function () {
          console.info('Data Loaded from JSON file');
          _this.store.process();
        }).catch(this.handleError.bind(this));
      }
    }
  }, {
    key: 'loadMissingReleasesOrProcess',
    value: function loadMissingReleasesOrProcess() {
      var loadReleases = this.store._.missingReleaseIds.length > 0;
      if (loadReleases) {
        this.store.loadMissingReleases().then(function () {
          window.location.reload();
        }).catch(this.handleError.bind(this));
      } else {
        this.store.process();
      }
    }
  }, {
    key: 'testLoadingMessages',
    value: function testLoadingMessages() {
      var _this2 = this;

      this.store.renderer.loading.enable();
      this.store.renderer.loading.message('Test a message like it is hot. ' + new Date().getTime());
      window.setTimeout(function () {
        _this2.testLoadingMessages();
      }, 1000);
    }
  }, {
    key: '_formattedVisitor',
    value: function _formattedVisitor(visitor) {
      return {
        id: visitor.uid,
        name: visitor.displayName,
        email: visitor.email,
        photo: visitor.photoURL
      };
    }
  }, {
    key: 'handleError',
    value: function handleError(error) {
      console.warn(error);
      this.store.renderer.loading.disable();
    }
  }]);

  return App;
}();

exports.default = App;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Firestore = __webpack_require__(7);

var _Firestore2 = _interopRequireDefault(_Firestore);

var _Renderer = __webpack_require__(13);

var _Renderer2 = _interopRequireDefault(_Renderer);

var _Webtask = __webpack_require__(1);

var _Webtask2 = _interopRequireDefault(_Webtask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LOCAL_KEY = 'discogs-library-0.1',
    BATCH_SIZE = 10,
    BATCH_SECONDS = 15;

var Store = function () {
  function Store(database, app) {
    _classCallCheck(this, Store);

    this.localKey = LOCAL_KEY;
    this.app = app;
    this.firestore = new _Firestore2.default(database);
    this.webtask = new _Webtask2.default();
    this.renderer = new _Renderer2.default(this);
  }

  _createClass(Store, [{
    key: 'searchSpotifyForRelease',
    value: function searchSpotifyForRelease(artist, album) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.webtask.searchSpotify(artist, album).then(resolve).catch(reject);
      });
    }
  }, {
    key: 'loadAllDataFromLocalStorage',
    value: function loadAllDataFromLocalStorage() {
      var localData = this._getStore();
      if (localData) {
        this.setData(JSON.parse(localData));
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: 'getAllDataFromFirebase',
    value: function getAllDataFromFirebase() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.renderer.loading.enable();
        _this2.renderer.loading.message('Getting Collection from Database');
        _this2.firestore.getAllData().then(function (data) {
          _this2.setData(data);
          _this2.renderer.loading.disable();
          resolve();
        }).catch(reject);
      });
    }
  }, {
    key: 'loadAllDataFromJSON',
    value: function loadAllDataFromJSON() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.renderer.loading.enable();
        _this3.renderer.loading.message('Loading Data');
        axios.get('data/' + LOCAL_KEY + '.json', {}).then(function (data) {
          _this3.setData(data.data);
          _this3.renderer.loading.disable();
          resolve();
        }).catch(reject);
      });
    }
  }, {
    key: 'updateCollection',
    value: function updateCollection() {
      var _this4 = this;

      this.renderer.loading.enable();
      this.renderer.loading.message('Getting Collection from Discogs');
      return new Promise(function (resolve, reject) {
        _this4.webtask.getCollection().then(function (data) {
          _this4.renderer.loading.message('Writing Collection to Database');
          _this4.firestore.writeCollection(data).then(function (data) {
            _this4.renderer.loading.message('Wrote Collection to Database');
            _this4._clearStore();
            resolve();
          }).catch(reject);
        }).catch(reject);
      });
    }
  }, {
    key: 'setData',
    value: function setData(_ref) {
      var _this5 = this;

      var user = _ref.user,
          collection = _ref.collection,
          releases = _ref.releases;

      this._ = {
        user: user,
        releases: releases,
        collectionFolders: collection.folders,
        collectionReleases: collection.releases,
        missingReleaseIds: []
      };
      Object.keys(this._.collectionReleases).forEach(function (releaseId) {
        if (!_this5._.releases[releaseId]) _this5._.missingReleaseIds.push(releaseId);
      });
      this._setStore({ user: user, collection: collection, releases: releases });
    }
  }, {
    key: 'loadMissingReleases',
    value: function loadMissingReleases() {
      var _this6 = this;

      // "Loading" state of app with progress notifications
      this.renderer.loading.enable();
      this.renderer.loading.message('Loading ' + this._.missingReleaseIds.length + ' Releases from Discogs.');
      return new Promise(function (resolve, reject) {
        var ids = _this6._.missingReleaseIds,
            chunkedIds = [],

        // If we can, we do it all at once, otherwise we throttle to 10 per 15 seconds
        size = ids.length <= 60 ? 60 : BATCH_SIZE;
        while (ids.length > 0) {
          chunkedIds.push(ids.splice(0, size));
        }var chunks = chunkedIds.length,
            time = _this6._time(chunks * BATCH_SECONDS);
        _this6.renderer.loading.message('This will take around ' + time + ' in ' + chunks + ' pass(es).');
        // Get Release(s) from Webtask and progressively Write Release(s) to Firestore
        _this6.loadReleases(chunkedIds, chunks, 0).then(function () {
          _this6.renderer.loading.message('Completed ' + chunks + ' pass(es)');
          // Delete localStorage
          _this6._clearStore();
          resolve();
        }).catch(reject);
      });
    }
  }, {
    key: 'updateRelease',
    value: function updateRelease(id) {
      var _this7 = this;

      this.renderer.loading.enable();
      return new Promise(function (resolve, reject) {
        _this7.loadReleases([[id]], 1, 0).then(function (response) {
          _this7._.releases[id] = response.data[id];
          var _ref2 = _this7._,
              releases = _ref2.releases,
              user = _ref2.user,
              collection = {
            releases: _this7._.collectionReleases,
            folders: _this7._.collectionFolders
          };

          _this7._setStore({ user: user, collection: collection, releases: releases });
          _this7.renderer.loading.disable();
          resolve();
        }).catch(reject);
      });
    }

    // Recursively loading 60 releases/minute from Webtask then writing to Firestore.

  }, {
    key: 'loadReleases',
    value: function loadReleases(chunkedIds, chunks, index) {
      var _this8 = this;

      var count = chunkedIds[index].length,
          ids = chunkedIds[index].join(',');
      return new Promise(function (resolve, reject) {
        _this8.webtask.getReleases(ids).then(function (data) {
          index++;
          var time = _this8._time((chunks - index + 1) * BATCH_SECONDS);
          _this8.renderer.loading.message('Got ' + index + '/' + chunks + ' batches of Releases from Discogs. ~' + time + ' remaining.');
          // If we need to get more
          if (index < chunks) {
            // Write existing to Firebase (will load on window.reload later)
            _this8.firestore.writeReleases(data).then(function () {
              _this8.renderer.loading.message('Wrote ' + count + ' Releases to Database.');
            }).catch(reject);
            // Queue it again with the next batch
            setTimeout(function () {
              resolve(_this8.loadReleases(chunkedIds, chunks, index));
            }, 1000 * BATCH_SECONDS);
          } else {
            // We have what we need
            // Write existing to Firebase (will load on window.reload later)
            _this8.firestore.writeReleases(data).then(function () {
              _this8.renderer.loading.message('Wrote ' + count + ' Releases to Database.');
              // Resolve
              resolve(data);
            }).catch(reject);
          }
        }).catch(reject);
      });
    }
  }, {
    key: 'process',
    value: function process() {
      this.searchable = Object.values(this._.collectionReleases).map(this._searchableRelease.bind(this));
      this._categorizeReleases(this._.collectionReleases);
      this.fuseSearch = new Fuse(this.searchable, {
        shouldSort: true,
        includeMatches: true,
        tokenize: true,
        matchAllTokens: true,
        findAllMatches: true,
        threshold: 0.3,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 3,
        keys: ['artistTitle']
      });
      this.randomRelease();
    }
  }, {
    key: 'randomRelease',
    value: function randomRelease() {
      var ids = Object.keys(this._.releases),
          id = ids[Math.floor(Math.random() * ids.length)];
      this.renderer.release.render(id);
    }
  }, {
    key: 'search',
    value: function search(term) {
      if (!this.fuseSearch) return null;
      if (!term) return null;
      return this.fuseSearch.search(term);
    }
  }, {
    key: '_time',
    value: function _time(seconds) {
      var minutes = Math.floor(seconds / 60);
      seconds = seconds - minutes * 60;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      return minutes + ':' + seconds;
    }
  }, {
    key: '_getStore',
    value: function _getStore() {
      return localStorage.getItem(LOCAL_KEY);
    }
  }, {
    key: '_setStore',
    value: function _setStore(data) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
    }
  }, {
    key: '_clearStore',
    value: function _clearStore() {
      localStorage.removeItem(LOCAL_KEY);
    }
  }, {
    key: '_searchableRelease',
    value: function _searchableRelease(collectionRelease) {
      var release = this._.releases[collectionRelease.id],
          response = {};
      response.id = release.id;
      response.title = release.title;
      response.year = release.year;
      response.artist = Object.values(release.artists).map(function (a) {
        return a.name;
      }).join(', ');
      response.artistTitle = response.artist + ': ' + response.title;
      response.folder = this._.collectionFolders[collectionRelease.folderId].name;
      var formats = {};
      release.formats.forEach(function (format) {
        return formats[format.name] = 1;
      });
      response.format = Object.keys(formats).join(', ');
      return response;
    }
  }, {
    key: '_categorizeReleases',
    value: function _categorizeReleases(collectionReleases) {
      var _this9 = this;

      this.categorized = { artist: {}, label: {}, companies: {} };
      Object.values(collectionReleases).forEach(function (collectionRelease) {
        var release = _this9._.releases[collectionRelease.id];
        Object.values(release.artists).forEach(function (artist) {
          var name = artist.name;
          if (name !== 'Various') {
            _this9.categorized.artist[name] = _this9.categorized.artist[name] || [];
            _this9.categorized.artist[name].push(release.id);
          }
        });
        Object.values(release.labels).forEach(function (label) {
          var name = label.name;
          _this9.categorized.label[name] = _this9.categorized.label[name] || [];
          _this9.categorized.label[name].push(release.id);
        });
        Object.values(release.companies).forEach(function (company) {
          var name = company.type + '-' + company.name;
          _this9.categorized.companies[name] = _this9.categorized.companies[name] || [];
          _this9.categorized.companies[name].push(release.id);
        });
      });
    }
  }]);

  return Store;
}();

exports.default = Store;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = __webpack_require__(8);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DISCOGS_USERNAME = 'jakealbaugh';

var Firestore = function () {
  function Firestore(database) {
    _classCallCheck(this, Firestore);

    for (var key in _index2.default) {
      _index2.default[key].initialize(database);
    }
  }

  _createClass(Firestore, [{
    key: 'getAllData',
    value: function getAllData() {
      return new Promise(function (resolve, reject) {
        var response = { collection: {} };
        _index2.default.Users.get(DISCOGS_USERNAME).then(function (user) {
          if (user.exists) {
            response.user = user.data();
            _index2.default.Folders.getCollectionFolders(DISCOGS_USERNAME).then(function (folders) {
              response.collection.folders = folders;
              _index2.default.Releases.getCollectionReleases(DISCOGS_USERNAME).then(function (releases) {
                response.collection.releases = releases;
                _index2.default.Releases.getReleases().then(function (releases) {
                  response.releases = releases;
                  resolve(response);
                }).catch(reject);
              }).catch(reject);
            }).catch(reject);
          } else {
            response.user = {};
            response.collection = { folders: {}, releases: {} };
            response.releases = {};
            resolve(response);
          }
        }).catch(reject);
      });
    }
  }, {
    key: 'writeCollection',
    value: function writeCollection(response) {
      return new Promise(function (resolve, reject) {
        if (response.status !== 200) reject(response);
        var status = response.status,
            data = response.data;
        var user = data.user,
            releases = data.releases,
            folders = data.folders;

        _index2.default.Users.create(user).then(function () {
          _index2.default.Folders.batchCreateCollectionFolders(user, folders).then(function () {
            _index2.default.Releases.batchCreateCollectionReleases(user, releases).then(resolve).catch(reject);
          }).catch(reject);
        }).catch(reject);
      });
    }
  }, {
    key: 'writeReleases',
    value: function writeReleases(response) {
      return new Promise(function (resolve, reject) {
        if (response.status !== 200) reject(response);
        var status = response.status,
            data = response.data;

        _index2.default.Releases.batchCreateReleases(data).then(resolve).catch(reject);
      });
    }
  }]);

  return Firestore;
}();

exports.default = Firestore;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Folders = __webpack_require__(9);

var _Folders2 = _interopRequireDefault(_Folders);

var _Releases = __webpack_require__(10);

var _Releases2 = _interopRequireDefault(_Releases);

var _Users = __webpack_require__(12);

var _Users2 = _interopRequireDefault(_Users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Adapters = {
  Folders: new _Folders2.default(),
  Releases: new _Releases2.default(),
  Users: new _Users2.default()
};

exports.default = Adapters;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Adapter2 = __webpack_require__(0);

var _Adapter3 = _interopRequireDefault(_Adapter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Folders = function (_Adapter) {
  _inherits(Folders, _Adapter);

  function Folders() {
    _classCallCheck(this, Folders);

    return _possibleConstructorReturn(this, (Folders.__proto__ || Object.getPrototypeOf(Folders)).apply(this, arguments));
  }

  _createClass(Folders, [{
    key: 'batchCreateCollectionFolders',
    value: function batchCreateCollectionFolders(user, folders) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var batch = _this2.database.batch();
        for (var folderId in folders) {
          var ref = _this2.database.collection('collections').doc(user.username).collection('folders').doc(folderId);
          batch.set(ref, folders[folderId]);
        }
        batch.commit().then(resolve).catch(reject);
      });
    }
  }, {
    key: 'getCollectionFolders',
    value: function getCollectionFolders(username) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.database.collection('collections').doc(username).collection('folders').get().then(function (snap) {
          return resolve(_this3.documents(snap));
        }).catch(reject);
      });
    }
  }]);

  return Folders;
}(_Adapter3.default);

exports.default = Folders;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Adapter2 = __webpack_require__(0);

var _Adapter3 = _interopRequireDefault(_Adapter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Releases = function (_Adapter) {
  _inherits(Releases, _Adapter);

  function Releases() {
    _classCallCheck(this, Releases);

    return _possibleConstructorReturn(this, (Releases.__proto__ || Object.getPrototypeOf(Releases)).apply(this, arguments));
  }

  _createClass(Releases, [{
    key: 'batchCreateCollectionReleases',
    value: function batchCreateCollectionReleases(user, releases) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        // Important! We delete an entire collection then get it again.
        _this2.batchDelete(user).then(function () {
          var batch = _this2.database.batch();
          for (var releaseId in releases) {
            var ref = _this2.database.collection('collections').doc(user.username).collection('releases').doc(releaseId);
            batch.set(ref, releases[releaseId]);
          }
          batch.commit().then(resolve).catch(reject);
        });
      });
    }
  }, {
    key: 'batchDelete',
    value: function batchDelete(user) {
      var _this3 = this;

      var batchSize = 20,
          query = this.database.collection('collections').doc(user.username).collection('releases').orderBy('__name__').limit(batchSize);

      return new Promise(function (resolve, reject) {
        _this3._deleteQueryBatch(query, batchSize, resolve, reject);
      });
    }
  }, {
    key: 'batchCreateReleases',
    value: function batchCreateReleases(releases) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var batch = _this4.database.batch();
        for (var releaseId in releases) {
          var ref = _this4.database.collection('releases').doc(releaseId);
          batch.set(ref, releases[releaseId]);
        }
        batch.commit().then(resolve).catch(reject);
      });
    }
  }, {
    key: 'getCollectionReleases',
    value: function getCollectionReleases(username) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        _this5.database.collection('collections').doc(username).collection('releases').get().then(function (snap) {
          return resolve(_this5.documents(snap));
        }).catch(reject);
      });
    }
  }, {
    key: 'getReleases',
    value: function getReleases() {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        _this6.database.collection('releases').get().then(function (snap) {
          return resolve(_this6.documents(snap));
        }).catch(reject);
      });
    }
  }, {
    key: '_deleteQueryBatch',
    value: function _deleteQueryBatch(query, batchSize, resolve, reject) {
      var _this7 = this;

      query.get().then(function (snapshot) {
        // When there are no documents left, we are done
        if (snapshot.size == 0) return 0;

        // Delete documents in a batch
        var batch = _this7.database.batch();
        snapshot.docs.forEach(function (doc) {
          batch.delete(doc.ref);
        });

        return batch.commit().then(function () {
          return snapshot.size;
        });
      }).then(function (numDeleted) {
        if (numDeleted < batchSize) {
          resolve();
          return;
        }

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(function () {
          _this7._deleteQueryBatch(query, batchSize, resolve, reject);
        });
      }).catch(reject);
    }
  }]);

  return Releases;
}(_Adapter3.default);

exports.default = Releases;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Adapter2 = __webpack_require__(0);

var _Adapter3 = _interopRequireDefault(_Adapter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Users = function (_Adapter) {
  _inherits(Users, _Adapter);

  function Users() {
    _classCallCheck(this, Users);

    return _possibleConstructorReturn(this, (Users.__proto__ || Object.getPrototypeOf(Users)).apply(this, arguments));
  }

  _createClass(Users, [{
    key: 'create',
    value: function create(user) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.database.collection('users').doc(user.username).set(user).then(resolve).catch(reject);
      });
    }
  }, {
    key: 'get',
    value: function get(username) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.database.collection('users').doc(username).get().then(resolve).catch(reject);
      });
    }
  }]);

  return Users;
}(_Adapter3.default);

exports.default = Users;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Loading = __webpack_require__(14);

var _Loading2 = _interopRequireDefault(_Loading);

var _Release = __webpack_require__(15);

var _Release2 = _interopRequireDefault(_Release);

var _Results = __webpack_require__(16);

var _Results2 = _interopRequireDefault(_Results);

var _View = __webpack_require__(17);

var _View2 = _interopRequireDefault(_View);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Renderer = function () {
  function Renderer(store) {
    var _this = this;

    _classCallCheck(this, Renderer);

    this.store = store;
    this.view = new _View2.default(this);
    this.loading = new _Loading2.default(this);
    this.results = new _Results2.default(this);
    this.release = new _Release2.default(this);
    this.resultIds = [];
    this.currResultIdx = -1;
    this.setSearch();
    this.$downloadStore = document.querySelector('#download-store');
    this.$downloadStoreClick = document.querySelector('#download-store-click');
    this.$downloadStoreClick.setAttribute('download', this.store.localKey + '.json');
    this.$updateCollection = document.querySelector('#update-collection');
    this.$updateRelease = document.querySelector('#update-release');
    this.$randomRelease = document.querySelector('#random-release');
    this.$randomRelease.addEventListener('click', function () {
      _this.store.randomRelease();
    });
    if (this.store.app.masterUser) {
      this.$updateCollection.addEventListener('click', function () {
        if (window.confirm('This might take a bit, are you sure?')) {
          _this.store.updateCollection().then(function () {
            window.location.reload();
          });
        }
      });
      this.$updateRelease.addEventListener('click', function () {
        var id = _this.resultIds[_this.currResultIdx];
        if (id) _this.store.updateRelease(id).then(function () {
          _this.release.render(id);
        });else alert('No Release to Update.');
      });
      this.$downloadStore.addEventListener('click', function () {
        _this.downloadStoreAsJSON();
      });
    } else {
      this.$downloadStore.remove();
      this.$downloadStoreClick.remove();
      this.$updateCollection.remove();
      this.$updateRelease.remove();
    }
    document.body.addEventListener('keydown', function (e) {
      if ([40, 38, 27, 13].includes(e.keyCode) && !_this.viewOpen) e.preventDefault();
      if (e.keyCode === 40) _this.handleArrowDown();else if (e.keyCode === 38) _this.handleArrowUp();else if (e.keyCode === 27) _this.handleEscape();else if (e.keyCode === 13) _this.handleReturn();
    });
  }

  _createClass(Renderer, [{
    key: 'downloadStoreAsJSON',
    value: function downloadStoreAsJSON() {
      var data = encodeURIComponent(this.store._getStore());
      this.$downloadStoreClick.setAttribute('href', 'data:text/json;charset=utf-8,' + data);
      this.$downloadStoreClick.click();
    }
  }, {
    key: 'setSearch',
    value: function setSearch() {
      var _this2 = this;

      this.$search = document.querySelector('#search');
      this.$search.focus();
      this.$search.addEventListener('input', function () {
        var results = _this2.store.search(_this2.$search.value.replace(/ +$/, ''));
        _this2.resultIds = [];
        _this2.currResultIdx = -1;
        _this2.results.render(results);
        _this2.handleArrowDown();
      });
    }
  }, {
    key: 'handleArrowDown',
    value: function handleArrowDown() {
      if (!this.viewOpen && this.currResultIdx < this.resultIds.length - 1) this.handleCurrentItem(1);
    }
  }, {
    key: 'handleArrowUp',
    value: function handleArrowUp() {
      if (!this.viewOpen && this.currResultIdx > 0) this.handleCurrentItem(-1);
    }
  }, {
    key: 'handleReturn',
    value: function handleReturn() {
      var id = this.currResultId;
      if (id) {
        this.viewOpen = !this.viewOpen;
        if (this.viewOpen) {
          this.view.render(this.store._.releases[id]);
          this.view.show();
        } else this.view.hide();
      }
    }
  }, {
    key: 'handleEscape',
    value: function handleEscape() {
      if (this.viewOpen) this.view.hide();
      this.viewOpen = false;
    }
  }, {
    key: 'handleItemClick',
    value: function handleItemClick(i) {
      this.currResultIdx = i;
      this.handleCurrentItem(0);
    }
  }, {
    key: 'handleCurrentItem',
    value: function handleCurrentItem(adder) {
      var id = null;
      if (this.resultIds.length > 0) {
        this.currResultIdx += adder;
        id = this.resultIds[this.currResultIdx];
        this.currResultId = id;
        this.release.render(id);
      }
      this.results.setCurrent(id);
    }
  }]);

  return Renderer;
}();

exports.default = Renderer;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Loading = function () {
  function Loading(renderer) {
    _classCallCheck(this, Loading);

    this.renderer = renderer;
    this.$container = document.querySelector('#loading');
    this.$container.classList.add('hide');
    this.$ul = this.$container.querySelector('ul');
  }

  _createClass(Loading, [{
    key: 'enable',
    value: function enable() {
      this.$container.classList.remove('hide');
    }
  }, {
    key: 'disable',
    value: function disable() {
      this.$container.classList.add('hide');
      this.$ul.innerHTML = '';
    }
  }, {
    key: 'message',
    value: function message(content) {
      var $li = document.createElement('li'),
          $last = this.$ul.querySelector('li:first-child');
      $li.innerHTML = content;
      if ($last) this.$ul.insertBefore($li, $last);else this.$ul.appendChild($li);
    }
  }]);

  return Loading;
}();

exports.default = Loading;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Release = function () {
  function Release(renderer) {
    _classCallCheck(this, Release);

    this.renderer = renderer;
    this.store = renderer.store;
    this.$container = document.querySelector('#details');
    this.$container.classList.add('hide');
    this.$ul = this.$container.querySelector('ul');
    this.$image = this.$container.querySelector('.image');
    this.$title = this.$container.querySelector('.title');
    this.$artist = this.$container.querySelector('.artist');
    this.$meta = this.$container.querySelector('.meta');
    this.$view = this.$container.querySelector('.view');
    this.$artistList = document.querySelector('.artist-list');
    this.$labelList = document.querySelector('.label-list');
    this.$companyList = document.querySelector('.company-list');
  }

  _createClass(Release, [{
    key: 'render',
    value: function render(id) {
      this.renderer.currResultId = id;
      this.renderer.$search.focus();
      this.release = this.store._.releases[id];
      this.renderMain();
      this.renderMeta();
      this.renderButton();
      this.renderLists();
    }
  }, {
    key: 'renderLists',
    value: function renderLists() {
      var _this = this;

      var used = [this.release.id];
      this.$artistList.innerHTML = '';
      Object.values(this.release.artists).forEach(function (artist) {
        var ids = _this.store.categorized.artist[artist.name];
        if (ids) _this.renderList(_this.$artistList, artist.name, ids, false, used);
      });
      this.$labelList.innerHTML = '';
      Object.values(this.release.labels).forEach(function (label) {
        var ids = _this.store.categorized.label[label.name];
        if (ids) _this.renderList(_this.$labelList, label.name, ids, true, used, 'Label');
      });
      this.$companyList.innerHTML = '';
      Object.values(this.release.companies).forEach(function (company) {
        var companyRole = company.type + '-' + company.name,
            ids = _this.store.categorized.companies[companyRole];
        if (ids) {
          _this.renderList(_this.$companyList, company.name, ids, true, used, company.type);
        }
      });
    }
  }, {
    key: 'renderMain',
    value: function renderMain() {
      var image = this.release.images ? this.release.images[0] : null;
      if (image) this.$image.style.backgroundImage = 'url(\'' + image.uri + '\')';else this.$image.style.backgroundImage = 'none';
      this.$title.innerHTML = '<a href="https://www.discogs.com/release/' + this.release.id + '" target="blank">\n      ' + this.release.title.replace(/ ([^ ]+)$/, '&nbsp;$1') + '\n    </a>';
      var year = this.release.year > 1900 ? ',&nbsp;' + this.release.year : '';
      this.$artist.innerHTML = Object.values(this.release.artists).map(function (artist) {
        return '<span><a href="https://www.discogs.com/artist/' + artist.id + '" target="blank">' + artist.name + '</a></span>';
      }).join(', ') + year;
    }
  }, {
    key: 'renderMeta',
    value: function renderMeta() {
      this.$meta.innerHTML = '';
      var labels = Object.values(this.release.labels).map(function (label) {
        return '<span>\n            <a href="https://www.discogs.com/label/' + label.id + '" target="blank">\n            ' + label.name.split(' ').join('&nbsp;') + '</a>&nbsp;' + label.catno.split(' ').join('&nbsp;') + '</span>';
      }).join(', ');
      this.$meta.innerHTML += '<p class="label">' + labels + '</p>';
    }
  }, {
    key: 'renderButton',
    value: function renderButton() {
      var _this2 = this;

      this.$view.innerHTML = '';
      var $button = document.createElement('button');
      $button.setAttribute('type', 'button');
      $button.setAttribute('title', 'shortcut: return');
      $button.classList.add('is-small');
      $button.innerHTML = 'View';
      $button.addEventListener('click', function () {
        _this2.renderer.handleReturn();
      });
      this.$view.appendChild($button);
    }
  }, {
    key: 'renderList',
    value: function renderList($list, title, ids, includeArtist) {
      var _this3 = this;

      var used = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
      var listType = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

      var $ul = void 0,
          rendered = false;
      ids.forEach(function (id) {
        if (!used.includes(id)) {
          if (!rendered) {
            var $p = document.createElement('p');
            $p.innerHTML = listType ? listType + ': ' + title : title;
            $list.appendChild($p);
            $ul = document.createElement('ul');
            $list.appendChild($ul);
            rendered = true;
          }
          var release = _this3.store._.releases[id],
              $li = document.createElement('li'),
              $a = document.createElement('a');
          $a.setAttribute('href', '#');
          $li.appendChild($a);
          $a.addEventListener('click', function (e) {
            e.preventDefault();
            _this3.render(release.id);
          });
          var year = release.year > 1900 ? release.year : '',
              image = release.images ? release.images[0] : null;
          if (image) $a.innerHTML += '<div class="image" style="background-image: url(\'' + image.uri + '\')"></div>';else $a.innerHTML += '<div class="image"></div>';
          if (includeArtist) {
            var artist = Object.values(release.artists).map(function (a) {
              return a.name;
            }).join(', ');
            title = release.title;
            artist = _this3.truncatedString(artist);
            title = _this3.truncatedString(title);
            $a.innerHTML += '<div><span><span>' + title + '</span><span>' + year + '</span></span><span>' + artist + '</span></div>';
          } else {
            var _title = release.title;
            _title = _this3.truncatedString(_title);
            $a.innerHTML += '<div><span><span>' + _title + '</span><span>' + year + '</span></span></div>';
          }
          $ul.appendChild($li);
        }
      });
    }
  }, {
    key: 'truncatedString',
    value: function truncatedString(string) {
      if (string.length <= 27) return string;
      return string.substring(0, 27).replace(/ +$/, '') + '\u2026';
    }
  }]);

  return Release;
}();

exports.default = Release;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Results = function () {
  function Results(renderer) {
    _classCallCheck(this, Results);

    this.renderer = renderer;
    this.store = renderer.store;
    this.$container = document.querySelector('#results');
  }

  _createClass(Results, [{
    key: 'setCurrent',
    value: function setCurrent(id, adder) {
      var $curr = this.$container.querySelector('li.selected');
      if ($curr) $curr.classList.remove('selected');
      if (id) {
        var $el = this.$container.querySelector('li.release-' + id);
        $el.classList.add('selected');
        $el.scrollIntoView();
      }
    }
  }, {
    key: 'render',
    value: function render(results) {
      var _this = this;

      this.currResultIdx = -1;
      this.$container.innerHTML = '';
      if (!results) return;
      var max = Math.min(30, results.length);

      var _loop = function _loop(i) {
        var result = results[i],
            $li = document.createElement('li'),
            $a = document.createElement('a');
        _this.renderer.resultIds.push(result.item.id);
        $li.classList.add('release-' + result.item.id);
        $a.innerHTML = _this.renderResult(result);
        $a.setAttribute('href', '#');
        $a.setAttribute('tabindex', '-1');
        $a.addEventListener('click', function (e) {
          e.preventDefault();
          $a.blur();
          _this.renderer.$search.focus();
          _this.renderer.handleItemClick(i);
        });
        $li.appendChild($a);
        _this.$container.appendChild($li);
      };

      for (var i = 0; i < max; i++) {
        _loop(i);
      }
    }
  }, {
    key: 'renderResult',
    value: function renderResult(result, type) {
      var _this2 = this;

      var matches = {};
      result.matches.forEach(function (match) {
        matches[match.key] = _this2.renderMatch(match);
      });
      var release = this.store._.releases[result.item.id],
          image = release.images ? release.images[0] : null,
          html = void 0;
      if (image) html = '<div class="image" style="background-image: url(\'' + image.uri + '\')"></div>';else html = '<div class="image"></div>';
      html += '\n      <div class="title">';
      if (matches.artistTitle) html += matches.artistTitle;else html += result.item.artist + ': ' + result.item.title;
      html += '\n        ' + (result.item.year > 1900 ? '(' + result.item.year + ')' : '') + '\n      </div>\n      <div class="format">\n        ' + result.item.format + '\n      </div>';
      return html;
    }
  }, {
    key: 'renderMatch',
    value: function renderMatch(match) {
      var value = match.value,
          starts = match.indices.map(function (i) {
        return i[0];
      }),
          stops = match.indices.map(function (i) {
        return i[1];
      }),
          useStart = true;
      var string = '';
      value.split('').forEach(function (char, i) {
        if (useStart) {
          if (starts[0] !== undefined && starts[0] === i) {
            if (starts[0] === stops[0]) {
              string += '<span>' + char + '</span>';
              stops.shift();
            } else {
              string += '<span>' + char;
              useStart = false;
            }
            starts.shift();
          } else {
            string += char;
          }
        } else {
          if (stops[0] !== undefined && stops[0] === i) {
            string += char + '</span>';
            stops.shift();
            useStart = true;
          } else {
            string += char;
          }
        }
      });

      return string;
    }
  }]);

  return Results;
}();

exports.default = Results;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = function () {
  function View(renderer) {
    var _this = this;

    _classCallCheck(this, View);

    this.renderer = renderer;
    this.store = renderer.store;
    this.$container = document.querySelector('#overlay');
    this.$h1 = this.$container.querySelector('h1');
    this.$image = this.$container.querySelector('.image');
    this.$title = this.$container.querySelector('.title');
    this.$artist = this.$container.querySelector('.artist');
    this.$meta = this.$container.querySelector('.meta');
    this.$close = this.$container.querySelector('#close');
    this.$close.addEventListener('click', function () {
      _this.renderer.handleEscape();
    });
    this.$companies = this.$container.querySelector('.companies');
    this.$tracklist = this.$container.querySelector('.tracklist ul');
    this.$spotify = this.$container.querySelector('.tracklist iframe');
  }

  _createClass(View, [{
    key: 'hide',
    value: function hide() {
      this.$container.classList.add('hide');
      this.renderer.$search.focus();
    }
  }, {
    key: 'show',
    value: function show() {
      this.$container.classList.remove('hide');
      this.$tracklist.focus();
    }
  }, {
    key: 'render',
    value: function render(release) {
      var collectionRelease = this.store._.collectionReleases[release.id];
      this.renderImage(release);
      this.renderTitle(release);
      this.renderArtist(release);
      this.renderMeta(release, collectionRelease);
      this.renderCompanies(release);
      this.renderTracklist(release);
    }
  }, {
    key: 'renderImage',
    value: function renderImage(_ref) {
      var images = _ref.images;

      var image = images[0];
      if (image) this.$image.style.backgroundImage = 'url(\'' + image.uri + '\')';else this.$image.style.backgroundImage = 'none';
    }
  }, {
    key: 'renderTitle',
    value: function renderTitle(_ref2) {
      var title = _ref2.title,
          id = _ref2.id;

      this.$title.innerHTML = '<a href="https://www.discogs.com/release/' + id + '" target="blank">\n      ' + title.replace(/ ([^ ]+)$/, '&nbsp;$1') + '\n    </a>';
      this.$h1.innerHTML = title;
    }
  }, {
    key: 'renderArtist',
    value: function renderArtist(_ref3) {
      var artists = _ref3.artists,
          year = _ref3.year;

      year = year > 1900 ? ',&nbsp;' + year : '';
      this.$artist.innerHTML = Object.values(artists).map(function (_ref4) {
        var id = _ref4.id,
            name = _ref4.name;
        return '<span><a href="https://www.discogs.com/artist/' + id + '" target="blank">' + name + '</a></span>';
      }).join(', ') + year;
    }
  }, {
    key: 'renderMeta',
    value: function renderMeta(_ref5, _ref6) {
      var formats = _ref5.formats,
          labels = _ref5.labels;
      var added = _ref6.added,
          folderId = _ref6.folderId;

      this.$meta.innerHTML = '';
      labels = Object.values(labels).map(function (label) {
        return '<span>\n            <a href="https://www.discogs.com/label/' + label.id + '" target="blank">\n            ' + label.name.split(' ').join('&nbsp;') + '</a>&nbsp;' + label.catno + '</span>';
      }).join(', ');
      this.$meta.innerHTML += '<p class="label">' + labels + '</p>';

      var formatTypes = {};
      this.$meta.innerHTML += '<p class="format">' + formats.map(function (format) {
        if (formatTypes[format.name]) return '';
        formatTypes[format.name] = 1;
        return '<span>' + format.name + ' (' + format.quantity + ')</span>';
      }).join('') + '</p>';

      var folder = this.store._.collectionFolders[folderId].name,
          date = this.renderDateFromEpoch(added);
      this.$meta.innerHTML += '<p class="folder"><strong>' + folder + '</strong> ' + date + '</p>';
    }
  }, {
    key: 'renderCompanies',
    value: function renderCompanies(_ref7) {
      var companies = _ref7.companies;

      this.$companies.innerHTML = '';
      companies = Object.values(companies).map(function (_ref8) {
        var name = _ref8.name,
            id = _ref8.id,
            type = _ref8.type;
        return '<span>\n            ' + type + ':\n            <a href="https://www.discogs.com/label/' + id + '" target="blank">\n            ' + name.split(' ').join('&nbsp;') + '</a></span>';
      }).join('<br>');
      this.$companies.innerHTML += '<p class="label">' + companies + '</p>';
    }
  }, {
    key: 'renderTracklist',
    value: function renderTracklist(release) {
      var _this2 = this;

      var tracklist = release.tracklist,
          artists = release.artists,
          title = release.title;

      this.$tracklist.innerHTML = '';
      this.$spotify.setAttribute('href', '');
      this.$spotify.classList.add('hide');
      var artist = Object.values(artists)[0].name;
      this.renderer.store.searchSpotifyForRelease(artist, title).then(function (data) {
        var album = data.data.albums.items[0];
        if (album) {
          _this2.$spotify.setAttribute('href', 'https://open.spotify.com/embed/album/' + album.id);
          _this2.$spotify.classList.remove('hide');
        }
      });
      tracklist.forEach(function (track) {
        var $li = document.createElement('li'),
            title = track.title.replace(/ ([^ ]+)$/, '&nbsp;$1');
        $li.classList.add(track.type);
        $li.innerHTML = '<span>' + track.position + '</span><span>' + title + '</span>';
        _this2.$tracklist.appendChild($li);
      });
    }
  }, {
    key: 'truncatedString',
    value: function truncatedString(string) {
      if (string.length <= 75) return string;
      return string.substring(0, 75).replace(/ +$/, '') + '\u2026';
    }
  }, {
    key: 'renderDateFromEpoch',
    value: function renderDateFromEpoch(epoch) {
      var includeDay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var date = new Date(epoch),
          monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          year = date.getFullYear(),
          month = monthNames[date.getMonth()],
          day = date.getDate();
      if (includeDay) return month + ' ' + day + ', ' + year;else return month + ' ' + year;
    }
  }]);

  return View;
}();

exports.default = View;

/***/ })
/******/ ]);