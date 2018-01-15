import Adapters from '../adapters/index';

const DISCOGS_USERNAME = 'jakealbaugh';

export default class Firestore {
  constructor(database) {
    for (let key in Adapters) Adapters[key].initialize(database);
  }

  getAllData() {
    return new Promise((resolve, reject) => {
      let response = { collection: {} };
      Adapters.Users
        .get(DISCOGS_USERNAME)
        .then(user => {
          if (user.exists) {
            response.user = user.data();
            Adapters.Folders
              .getCollectionFolders(DISCOGS_USERNAME)
              .then(folders => {
                response.collection.folders = folders;
                Adapters.Releases
                  .getCollectionReleases(DISCOGS_USERNAME)
                  .then(releases => {
                    response.collection.releases = releases;
                    Adapters.Releases
                      .getReleases()
                      .then(releases => {
                        response.releases = releases;
                        resolve(response);
                      })
                      .catch(reject);
                  })
                  .catch(reject);
              })
              .catch(reject);
          } else {
            response.user = {};
            response.collection = { folders: {}, releases: {} };
            response.releases = {};
            resolve(response);
          }
        })
        .catch(reject);
    });
  }

  writeCollection(response) {
    return new Promise((resolve, reject) => {
      if (response.status !== 200) reject(response);
      let { status, data } = response;
      let { user, releases, folders } = data;
      Adapters.Users
        .create(user)
        .then(() => {
          Adapters.Folders
            .batchCreateCollectionFolders(user, folders)
            .then(() => {
              Adapters.Releases
                .batchCreateCollectionReleases(user, releases)
                .then(resolve)
                .catch(reject);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  writeReleases(response) {
    return new Promise((resolve, reject) => {
      if (response.status !== 200) reject(response);
      let { status, data } = response;
      Adapters.Releases
        .batchCreateReleases(data)
        .then(resolve)
        .catch(reject);
    });
  }
}
