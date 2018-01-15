import Adapter from './Adapter';

export default class Spotify extends Adapter {
  updateSpotifyId(releaseId, spotifyId) {
    return new Promise((resolve, reject) => {
      this.database
        .collection('spotify')
        .doc(releaseId)
        .set({ id: spotifyId })
        .then(resolve)
        .catch(reject);
    });
  }

  batchUpdateSpotify(releases) {
    let batch = this.database.batch();
    for (let releaseId in releases) {
      let ref = this.database.collection('spotify').doc(releaseId);
      batch.set(ref, releases[releaseId].id);
    }
    batch
      .commit()
      .then(resolve)
      .catch(reject);
  }

  get() {
    return new Promise((resolve, reject) => {
      this.database
        .collection('spotify')
        .get()
        .then(snap => resolve(this.documents(snap)))
        .catch(reject);
    });
  }
}
