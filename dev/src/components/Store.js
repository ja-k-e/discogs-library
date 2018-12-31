import Firestore from "./Firestore";
import Renderer from "../renderers/Renderer";
import Webtask from "./Webtask";

const LOCAL_KEY = "discogs-library-0.1",
  BATCH_SIZE = 10,
  BATCH_SECONDS = 15;

export default class Store {
  constructor(database, app) {
    this.localKey = LOCAL_KEY;
    this.app = app;
    this.firestore = new Firestore(database);
    this.webtask = new Webtask();
    this.renderer = new Renderer(this);
    // this._clearStore();
  }

  searchSpotify(release) {
    return new Promise((resolve, reject) => {
      this.searchSpotifyForRelease(release).then(id => {
        this.firestore.updateSpotifyId(release.id, id).then(() => {
          resolve(id);
        });
      });
    });
  }

  // One-off update
  updateSpotifyId(releaseId, spotifyId) {
    return new Promise((resolve, reject) => {
      this.firestore
        .updateSpotifyId(releaseId, spotifyId)
        .then(() => {
          this._.spotify[releaseId] = { id: spotifyId };
          this.saveState();
          resolve();
        })
        .catch(reject);
    });
  }

  searchSpotifyForRelease({ artists, title, id }) {
    // We try a few different things here.
    // Then we try it without extra parens at the end of the title
    artists = Object.values(artists).map(artist => artist.name);
    // Do the OR combination for artist if we can
    let artist = artists[1] ? `${artists[0]}OR${artists[1]}` : artists[0];
    return new Promise((resolve, reject) => {
      // If we saved it, return it.
      if (this._.spotify[id]) {
        resolve(this._.spotify[id].id);
        return;
      } else if (this._.spotify[id] === "") {
        resolve("");
        return;
      }

      this.webtask
        .searchSpotify(artist, title)
        .then(response => {
          let album = response.data.albums.items[0];
          if (album) {
            resolve(album.id);
          } else {
            // Try searching without ending parens
            let title2 = title.replace(/ \([^\)]+\)$/, "");
            this.webtask
              .searchSpotify(artist, title2)
              .then(response => {
                let album = response.data.albums.items[0];
                if (album) {
                  resolve(album.id);
                } else {
                  // Try searching just the title
                  this.webtask
                    .searchSpotify(null, title)
                    .then(response => {
                      let album = response.data.albums.items[0];
                      if (album) {
                        resolve(album.id);
                      } else {
                        resolve("");
                      }
                    })
                    .catch(reject);
                }
              })
              .catch(reject);
          }
        })
        .catch(reject);
    });
  }

  loadAllDataFromLocalStorage() {
    let localData = this._getStore();
    if (localData) {
      this.setData(JSON.parse(localData));
      return true;
    } else {
      return false;
    }
  }

  getAllDataFromFirebase() {
    return new Promise((resolve, reject) => {
      this.renderer.loading.enable();
      this.renderer.loading.message("Getting Collection from Database");
      this.firestore
        .getAllData()
        .then(data => {
          this.setData(data);
          this.renderer.loading.disable();
          resolve();
        })
        .catch(reject);
    });
  }

  loadAllDataFromJSON() {
    return new Promise((resolve, reject) => {
      this.renderer.loading.enable();
      this.renderer.loading.message("Loading Data");
      axios
        .get(`data/${LOCAL_KEY}.json`, {})
        .then(data => {
          this.setData(data.data);
          this.renderer.loading.disable();
          resolve();
        })
        .catch(reject);
    });
  }

  writeCollection() {
    this.renderer.loading.enable();
    this.renderer.loading.message("Getting Collection from Discogs");
    return new Promise((resolve, reject) => {
      this.webtask
        .getCollection()
        .then(data => {
          this.renderer.loading.message("Writing Collection to Database");
          this.firestore
            .writeCollection(data)
            .then(data => {
              this.renderer.loading.message("Wrote Collection to Database");
              this._clearStore();
              resolve();
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  updateCollection() {
    this.renderer.loading.enable();
    this.renderer.loading.message("Getting Recent Releases from Discogs");
    return new Promise((resolve, reject) => {
      this.webtask
        .getRecent()
        .then(data => {
          this.renderer.loading.message("Writing Releases to Database");
          this.firestore
            .updateCollection(data, this._.user.username)
            .then(data => {
              this.renderer.loading.message("Wrote Releases to Database");
              this._clearStore();
              resolve();
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  setData({ user, collection, releases, spotify }) {
    this._ = {
      user,
      releases,
      spotify,
      collectionFolders: collection.folders,
      collectionReleases: collection.releases,
      missingReleaseIds: []
    };
    Object.keys(this._.collectionReleases).forEach(releaseId => {
      if (!this._.releases[releaseId]) this._.missingReleaseIds.push(releaseId);
    });
    this._setStore({ user, collection, releases, spotify });
  }

  saveState() {
    let {
      user,
      collectionReleases,
      collectionFolders,
      releases,
      spotify
    } = this._;
    let collection = {
      folders: collectionFolders,
      releases: collectionReleases
    };
    this._setStore({ user, collection, releases, spotify });
  }

  loadMissingReleases() {
    // "Loading" state of app with progress notifications
    this.renderer.loading.enable();
    this.renderer.loading.message(
      `Loading ${this._.missingReleaseIds.length} Releases from Discogs.`
    );
    return new Promise((resolve, reject) => {
      let ids = this._.missingReleaseIds,
        chunkedIds = [],
        // If we can, we do it all at once, otherwise we throttle to 10 per 15 seconds
        size = ids.length <= 30 ? 30 : BATCH_SIZE;
      while (ids.length > 0) chunkedIds.push(ids.splice(0, size));
      let chunks = chunkedIds.length,
        time = this._time(chunks * BATCH_SECONDS);
      this.renderer.loading.message(
        `This will take around ${time} in ${chunks} pass(es).`
      );
      // Get Release(s) from Webtask and progressively Write Release(s) to Firestore
      this.loadReleases(chunkedIds, chunks, 0)
        .then(() => {
          this.renderer.loading.message(`Completed ${chunks} pass(es)`);
          // Delete localStorage
          this._clearStore();
          resolve();
        })
        .catch(reject);
    });
  }

  updateRelease(id) {
    this.renderer.loading.enable();
    return new Promise((resolve, reject) => {
      this.loadReleases([[id]], 1, 0)
        .then(response => {
          this._.releases[id] = response.data[id];
          if (!this._.spotify[id])
            this.searchSpotify(this._.releases[id]).then(spotifyId => {
              this._.spotify[id] = { id: spotifyId };
              this.saveState();
              this.renderer.loading.disable();
              resolve();
            });
          else {
            this.saveState();
            this.renderer.loading.disable();
            resolve();
          }
        })
        .catch(reject);
    });
  }

  // Recursively loading 30 releases/minute from Webtask then writing to Firestore.
  loadReleases(chunkedIds, chunks, index) {
    let count = chunkedIds[index].length,
      ids = chunkedIds[index].join(",");
    return new Promise((resolve, reject) => {
      this.webtask
        .getReleases(ids)
        .then(data => {
          index++;
          let time = this._time((chunks - index + 1) * BATCH_SECONDS);
          this.renderer.loading.message(
            `Got ${index}/${chunks} batches of Releases from Discogs. ~${time} remaining.`
          );
          // If we need to get more
          if (index < chunks) {
            // Write existing to Firebase (will load on window.reload later)
            this.firestore
              .writeReleases(data)
              .then(() => {
                this.renderer.loading.message(
                  `Wrote ${count} Releases to Database.`
                );
              })
              .catch(reject);
            // Queue it again with the next batch
            setTimeout(() => {
              resolve(this.loadReleases(chunkedIds, chunks, index));
            }, 1000 * BATCH_SECONDS);
          } else {
            // We have what we need
            // Write existing to Firebase (will load on window.reload later)
            this.firestore
              .writeReleases(data)
              .then(() => {
                this.renderer.loading.message(
                  `Wrote ${count} Releases to Database.`
                );
                // Resolve
                resolve(data);
              })
              .catch(reject);
          }
        })
        .catch(reject);
    });
  }

  process() {
    this.searchableReleases = Object.values(this._.collectionReleases).map(
      this._searchableRelease.bind(this)
    );
    this._categorizeReleases(this._.collectionReleases);

    this.searchableCompanies = Object.values(this.companies);

    this.fuseReleaseSearch = new Fuse(this.searchableReleases, {
      shouldSort: true,
      includeMatches: true,
      tokenize: true,
      matchAllTokens: true,
      findAllMatches: true,
      threshold: 0.3,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 2,
      keys: ["artistTitle"]
    });
    this.fuseCompanySearch = new Fuse(this.searchableCompanies, {
      shouldSort: true,
      includeMatches: true,
      tokenize: true,
      matchAllTokens: true,
      findAllMatches: true,
      threshold: 0.3,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 2,
      keys: ["name"]
    });
    this.randomRelease();
    this.detectMissingSpotify();
  }

  detectMissingSpotify() {
    let ids = Object.keys(this._.spotify);
    let missing = Object.values(this._.collectionReleases).filter(
      i => !ids.includes(i.id)
    );
    if (missing.length > 0) {
      console.info("Missing Spotify Data");
      console.info(
        missing.map(i => {
          let { title, id } = this._.releases[i.id];
          return { title, id };
        })
      );
    }
  }

  randomRelease() {
    let ids = Object.keys(this._.releases),
      id = ids[Math.floor(Math.random() * ids.length)];
    this.renderer.results.itemType = "release";
    this.renderer.currResultId = id;
    this.renderer.release.render(id);
  }

  search(term, type) {
    if (!this.fuseReleaseSearch) return null;
    if (!term) return null;
    let search =
      type === "release" ? this.fuseReleaseSearch : this.fuseCompanySearch;
    return search.search(term);
  }

  _time(seconds) {
    let minutes = Math.floor(seconds / 30);
    seconds = seconds - minutes * 30;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
  }

  _getStore() {
    return localStorage.getItem(LOCAL_KEY);
  }

  _setStore(data) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  }

  _clearStore() {
    localStorage.removeItem(LOCAL_KEY);
  }

  _searchableRelease(collectionRelease) {
    let release = this._.releases[collectionRelease.id],
      response = {};
    response.id = release.id;
    response.title = release.title;
    response.year = release.year;
    response.artist = Object.values(release.artists)
      .map(a => a.name)
      .join(", ");
    response.artistTitle = response.artist + ": " + response.title;
    response.folder = this._.collectionFolders[collectionRelease.folderId].name;
    response.companies = Object.values(release.labels)
      .concat(Object.values(release.companies))
      .map(c => c.name)
      .join(", ");
    let formats = {};
    release.formats.forEach(format => (formats[format.name] = 1));
    response.format = Object.keys(formats).join(", ");
    return response;
  }

  _categorizeReleases(collectionReleases) {
    this.categorized = { artist: {}, label: {}, companies: {} };
    this.companies = {};
    Object.values(collectionReleases).forEach(collectionRelease => {
      let release = this._.releases[collectionRelease.id];
      Object.values(release.artists).forEach(artist => {
        let name = artist.name;
        if (name !== "Various") {
          this.categorized.artist[name] = this.categorized.artist[name] || [];
          this.categorized.artist[name].push(release.id);
        }
      });
      Object.values(release.labels)
        .concat(Object.values(release.companies))
        .forEach(company => {
          let key = `${company.type}-${company.id}`,
            existing = this.companies[company.id];
          if (existing) {
            if (!existing.types.includes(company.type))
              existing.types.push(company.type);
          } else
            this.companies[company.id] = {
              id: company.id,
              name: company.name,
              types: [company.type]
            };
          this.categorized.companies[key] =
            this.categorized.companies[key] || [];
          this.categorized.companies[key].push(release.id);
        });
    });
  }
}
