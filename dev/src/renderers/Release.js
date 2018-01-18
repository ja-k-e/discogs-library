import CompanyAndRelease from './CompanyAndRelease';

export default class Release extends CompanyAndRelease {
  render(id) {
    this.renderer.currResultId = id;
    this.renderer.$search.focus();
    this.renderer.$updateRelease.removeAttribute('disabled');
    this.release = this.store._.releases[id];
    this.$image.classList.remove('hide');
    this.$artist.classList.remove('hide');
    this.$meta.classList.remove('hide');
    this.$view.classList.remove('hide');
    this.$artistList.classList.remove('hide');
    this.$labelList.classList.remove('hide');
    this.renderMain();
    this.renderMeta();
    this.renderButton();
    this.renderLists();
  }

  renderLists() {
    let used = [this.release.id];
    this.$artistList.innerHTML = '';
    Object.values(this.release.artists).forEach(artist => {
      let ids = this.store.categorized.artist[artist.name];
      if (ids) this.renderList(this.$artistList, artist.name, ids, false, used);
    });
    this.$labelList.innerHTML = '';
    Object.values(this.release.labels).forEach(label => {
      let ids = this.store.categorized.companies[`Label-${label.id}`];
      if (ids)
        this.renderList(this.$labelList, label.name, ids, true, used, 'Label');
    });
    this.$companyList.innerHTML = '';
    Object.values(this.release.companies).forEach(company => {
      let companyRole = `${company.type}-${company.id}`,
        ids = this.store.categorized.companies[companyRole];
      if (ids) {
        this.renderList(
          this.$companyList,
          company.name,
          ids,
          true,
          used,
          company.type
        );
      }
    });
  }

  renderMain() {
    let image = this.release.images ? this.release.images[0] : null;
    if (image) this.$image.style.backgroundImage = `url('${image.uri}')`;
    else this.$image.style.backgroundImage = 'none';
    this.$title.innerHTML = `<a href="https://www.discogs.com/release/${this
      .release.id}" target="blank">
      ${this.release.title.replace(/ ([^ ]+)$/, '&nbsp;$1')}
    </a>`;
    let year = this.release.year > 1900 ? `,&nbsp;${this.release.year}` : '';
    this.$artist.innerHTML =
      Object.values(this.release.artists)
        .map(
          artist =>
            `<span><a href="https://www.discogs.com/artist/${artist.id}" target="blank">${artist.name}</a></span>`
        )
        .join(', ') + year;
  }

  renderMeta() {
    this.$meta.innerHTML = '';
    let labels = Object.values(this.release.labels)
      .map(
        label =>
          `<span>
            <a href="https://www.discogs.com/label/${label.id}" target="blank">
            ${label.name
              .split(' ')
              .join('&nbsp;')}</a>&nbsp;${label.catno
            .split(' ')
            .join('&nbsp;')}</span>`
      )
      .join(', ');
    this.$meta.innerHTML += `<p class="label">${labels}</p>`;
  }

  renderButton() {
    this.$view.innerHTML = '';
    let $button = document.createElement('button');
    $button.setAttribute('type', 'button');
    $button.setAttribute('title', 'shortcut: return');
    $button.classList.add('is-small');
    $button.innerHTML = 'View';
    $button.addEventListener('click', () => {
      this.renderer.handleReturn();
    });
    this.$view.appendChild($button);
  }
}
