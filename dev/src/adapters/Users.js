import Adapter from './Adapter';

export default class Users extends Adapter {
  create(user) {
    return new Promise((resolve, reject) => {
      this.database
        .collection('users')
        .doc(user.username)
        .set(user)
        .then(resolve)
        .catch(reject);
    });
  }

  get(username) {
    return new Promise((resolve, reject) => {
      this.database
        .collection('users')
        .doc(username)
        .get()
        .then(resolve)
        .catch(reject);
    });
  }
}
