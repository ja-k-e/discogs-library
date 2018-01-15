import Adapter from './Adapter';

export default class Folders extends Adapter {
  batchCreateCollectionFolders(user, folders) {
    return new Promise((resolve, reject) => {
      let batch = this.database.batch();
      for (let folderId in folders) {
        let ref = this.database
          .collection('collections')
          .doc(user.username)
          .collection('folders')
          .doc(folderId);
        batch.set(ref, folders[folderId]);
      }
      batch
        .commit()
        .then(resolve)
        .catch(reject);
    });
  }

  getCollectionFolders(username) {
    return new Promise((resolve, reject) => {
      this.database
        .collection('collections')
        .doc(username)
        .collection('folders')
        .get()
        .then(snap => resolve(this.documents(snap)))
        .catch(reject);
    });
  }
}
