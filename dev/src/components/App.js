import Store from './Store';
import Webtask from './Webtask';

const MASTER_EMAIL = 'jake.albaugh@gmail.com';

export default class App {
  constructor({ database, visitor }) {
    this.visitor = this._formattedVisitor(visitor);
    this.masterUser = this.visitor.email === MASTER_EMAIL;
    this.store = new Store(database, this);
    this.initialize();
  }

  initialize() {
    // this.testLoadingMessages();
    if (this.masterUser) {
      let localData = this.store.loadAllDataFromLocalStorage();
      if (localData) {
        console.info('Data Loaded from localStorage');
        this.loadMissingReleasesOrProcess();
      } else {
        this.store
          .getAllDataFromFirebase()
          .then(() => {
            console.info('Data Loaded from Firestore');
            this.loadMissingReleasesOrProcess();
          })
          .catch(this.handleError.bind(this));
      }
    } else {
      this.store
        .loadAllDataFromJSON()
        .then(() => {
          console.info('Data Loaded from JSON file');
          this.store.process();
        })
        .catch(this.handleError.bind(this));
    }
  }

  loadMissingReleasesOrProcess() {
    let loadReleases = this.store._.missingReleaseIds.length > 0;
    if (loadReleases) {
      this.store
        .loadMissingReleases()
        .then(() => {
          window.location.reload();
        })
        .catch(this.handleError.bind(this));
    } else {
      this.store.process();
    }
  }

  testLoadingMessages() {
    this.store.renderer.loading.enable();
    this.store.renderer.loading.message(
      'Test a message like it is hot. ' + new Date().getTime()
    );
    window.setTimeout(() => {
      this.testLoadingMessages();
    }, 1000);
  }

  _formattedVisitor(visitor) {
    return {
      id: visitor.uid,
      name: visitor.displayName,
      email: visitor.email,
      photo: visitor.photoURL
    };
  }

  handleError(error) {
    console.warn(error);
    this.store.renderer.loading.disable();
  }
}
