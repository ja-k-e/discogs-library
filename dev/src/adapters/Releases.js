import Adapter from './Adapter';

export default class Releases extends Adapter {
  batchCreateCollectionReleases(user, releases) {
    return new Promise((resolve, reject) => {
      // Important! We delete an entire collection then get it again.
      this.batchDelete(user).then(() => {
        let batch = this.database.batch();
        for (let releaseId in releases) {
          let ref = this.database
            .collection('collections')
            .doc(user.username)
            .collection('releases')
            .doc(releaseId);
          batch.set(ref, releases[releaseId]);
        }
        batch
          .commit()
          .then(resolve)
          .catch(reject);
      });
    });
  }

  batchDelete(user) {
    let batchSize = 20,
      query = this.database
        .collection('collections')
        .doc(user.username)
        .collection('releases')
        .orderBy('__name__')
        .limit(batchSize);

    return new Promise((resolve, reject) => {
      this._deleteQueryBatch(query, batchSize, resolve, reject);
    });
  }

  batchCreateReleases(releases) {
    return new Promise((resolve, reject) => {
      let batch = this.database.batch();
      for (let releaseId in releases) {
        let ref = this.database.collection('releases').doc(releaseId);
        batch.set(ref, releases[releaseId]);
      }
      batch
        .commit()
        .then(resolve)
        .catch(reject);
    });
  }

  getCollectionReleases(username) {
    return new Promise((resolve, reject) => {
      this.database
        .collection('collections')
        .doc(username)
        .collection('releases')
        .get()
        .then(snap => resolve(this.documents(snap)))
        .catch(reject);
    });
  }

  getReleases() {
    return new Promise((resolve, reject) => {
      this.database
        .collection('releases')
        .get()
        .then(snap => resolve(this.documents(snap)))
        .catch(reject);
    });
  }

  _deleteQueryBatch(query, batchSize, resolve, reject) {
    query
      .get()
      .then(snapshot => {
        // When there are no documents left, we are done
        if (snapshot.size == 0) return 0;

        // Delete documents in a batch
        let batch = this.database.batch();
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });

        return batch.commit().then(() => snapshot.size);
      })
      .then(numDeleted => {
        if (numDeleted < batchSize) {
          resolve();
          return;
        }

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
          this._deleteQueryBatch(query, batchSize, resolve, reject);
        });
      })
      .catch(reject);
  }
}
