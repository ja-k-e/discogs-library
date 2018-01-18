import Company from './Company';
import Loading from './Loading';
import Release from './Release';
import Results from './Results';
import View from './View';

export default class Renderer {
  constructor(store) {
    this.store = store;
    this.view = new View(this);
    this.company = new Company(this);
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
    this.$clearLocal = document.querySelector('#clear-local');
    this.$updateRecent = document.querySelector('#update-recent');
    this.$updateRelease = document.querySelector('#update-release');
    this.$randomRelease = document.querySelector('#random-release');
    this.$randomRelease.addEventListener('click', () => {
      this.store.randomRelease();
    });
    if (this.store.app.masterUser) {
      this.$updateCollection.addEventListener('click', () => {
        if (window.confirm('This might take a bit, are you sure?')) {
          this.store.writeCollection().then(() => {
            window.location.reload();
          });
        }
      });
      this.$updateRecent.addEventListener('click', () => {
        this.store.updateCollection().then(() => {
          window.location.reload();
        });
      });
      this.$clearLocal.addEventListener('click', () => {
        this.store._clearStore();
        window.location.reload();
      });
      this.$updateRelease.addEventListener('click', () => {
        let id = this.currResultId;
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
      this.$clearLocal.remove();
      this.$downloadStore.remove();
      this.$downloadStoreClick.remove();
      this.$updateRecent.remove();
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
    this.$searchType = document.querySelector('#search-type');
    this.$search = document.querySelector('#search');
    this.$search.focus();
    this.$searchType.addEventListener('change', this.handleSearch.bind(this));
    this.$search.addEventListener('input', this.handleSearch.bind(this));
  }

  handleSearch() {
    let type = this.$searchType.checked ? 'company' : 'release',
      results = this.store.search(this.$search.value.replace(/ +$/, ''), type);
    this.resultIds = [];
    this.currResultIdx = -1;
    this.results.render(results, type);
    this.handleArrowDown();
  }

  handleArrowDown() {
    if (!this.viewOpen && this.currResultIdx < this.resultIds.length - 1)
      this.handleCurrentItem(1);
  }

  handleArrowUp() {
    if (!this.viewOpen && this.currResultIdx > 0) this.handleCurrentItem(-1);
  }

  handleReturn() {
    if (this.results.itemType !== 'release') return;
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
      if (this.results.itemType === 'release') this.release.render(id);
      else if (this.results.itemType === 'company') this.company.render(id);
    }
    this.results.setCurrent(id);
  }
}
