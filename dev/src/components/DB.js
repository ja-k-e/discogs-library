const firebaseKeys = require('firebase-settings');

export default class DB {
  constructor() {
    this.app = firebase.initializeApp(firebaseKeys);
    this.database = firebase.firestore(this.app);
    this.authorized = false;
  }

  authorize(callback) {
    this._authorized()
      .then(data => {
        this.authorized = true;
        callback(data);
      })
      .catch(this._authorize.bind(this));
  }

  authorizeWithoutSignin(success, error) {
    this._authorized()
      .then(data => {
        this.authorized = true;
        success(data);
      })
      .catch(() => error());
  }

  signOut() {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(resolve)
        .catch(reject);
    });
  }

  _authorized() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(existingUser => {
        if (existingUser) resolve(existingUser);
        else reject();
      });
    });
  }

  _authorize() {
    if (this.authorized) return;
    firebase
      .auth()
      .getRedirectResult()
      .then(result => {
        console.log('redirectresult', result.user);
      });
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithRedirect(provider);
  }
}
