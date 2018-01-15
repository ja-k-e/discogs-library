import Loading from './Loading';
import Release from './Release';
import Results from './Results';
import View from './View';

export default class Renderer {
  constructor(store) {
    this.store = store;
    this.view = new View(this);
    this.loading = new Loading(this);
    this.results = new Results(this);
    this.release = new Release(this);
    this.resultIds = [];
    this.currResultIdx = -1;
    this.setSearch();
    this.$downloadStore = document.querySelector('#download-store');
    this.$downloadStoreClick = document.querySelector('#download-store-click');
    this.$downloadStoreClick.setAttribute(
      'download',
      `${this.store.localKey}.json`
    );
    this.$updateCollection = document.querySelector('#update-collection');
    this.$updateRelease = document.querySelector('#update-release');
    this.$randomRelease = document.querySelector('#random-release');
    this.$randomRelease.addEventListener('click', () => {
      this.store.randomRelease();
    });
    if (this.store.app.masterUser) {
      this.$updateCollection.addEventListener('click', () => {
        if (window.confirm('This might take a bit, are you sure?')) {
          this.store.updateCollection().then(() => {
            window.location.reload();
          });
        }
      });
      this.$updateRelease.addEventListener('click', () => {
        let id = this.resultIds[this.currResultIdx];
        if (id)
          this.store.updateRelease(id).then(() => {
            this.release.render(id);
          });
        else alert('No Release to Update.');
      });
      this.$downloadStore.addEventListener('click', () => {
        this.downloadStoreAsJSON();
      });
    } else {
      this.$downloadStore.remove();
      this.$downloadStoreClick.remove();
      this.$updateCollection.remove();
      this.$updateRelease.remove();
    }
    document.body.addEventListener('keydown', e => {
      if ([40, 38, 27, 13].includes(e.keyCode) && !this.viewOpen)
        e.preventDefault();
      if (e.keyCode === 40) this.handleArrowDown();
      else if (e.keyCode === 38) this.handleArrowUp();
      else if (e.keyCode === 27) this.handleEscape();
      else if (e.keyCode === 13) this.handleReturn();
    });
  }

  downloadStoreAsJSON() {
    let data = encodeURIComponent(this.store._getStore());
    this.$downloadStoreClick.setAttribute(
      'href',
      `data:text/json;charset=utf-8,${data}`
    );
    this.$downloadStoreClick.click();
  }

  setSearch() {
    this.$search = document.querySelector('#search');
    this.$search.focus();
    this.$search.addEventListener('input', () => {
      let results = this.store.search(this.$search.value.replace(/ +$/, ''));
      this.resultIds = [];
      this.currResultIdx = -1;
      this.results.render(results);
      this.handleArrowDown();
    });
  }

  handleArrowDown() {
    if (!this.viewOpen && this.currResultIdx < this.resultIds.length - 1)
      this.handleCurrentItem(1);
  }

  handleArrowUp() {
    if (!this.viewOpen && this.currResultIdx > 0) this.handleCurrentItem(-1);
  }

  handleReturn() {
    let id = this.currResultId;
    if (id) {
      this.viewOpen = !this.viewOpen;
      if (this.viewOpen) {
        this.view.render(this.store._.releases[id]);
        this.view.show();
      } else this.view.hide();
    }
  }

  handleEscape() {
    if (this.viewOpen) this.view.hide();
    this.viewOpen = false;
  }

  handleItemClick(i) {
    this.currResultIdx = i;
    this.handleCurrentItem(0);
  }

  handleCurrentItem(adder) {
    let id = null;
    if (this.resultIds.length > 0) {
      this.currResultIdx += adder;
      id = this.resultIds[this.currResultIdx];
      this.currResultId = id;
      this.release.render(id);
    }
    this.results.setCurrent(id);
  }
}
