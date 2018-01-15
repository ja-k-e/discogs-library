export default class Release {
  constructor(renderer) {
    this.renderer = renderer;
    this.store = renderer.store;
    this.$container = document.querySelector('#details');
    this.$ul = this.$container.querySelector('ul');
    this.$image = this.$container.querySelector('.image');
    this.$title = this.$container.querySelector('.title');
    this.$artist = this.$container.querySelector('.artist');
    this.$meta = this.$container.querySelector('.meta');
    this.$view = this.$container.querySelector('.view');
    this.$artistList = document.querySelector('.artist-list');
    this.$labelList = document.querySelector('.label-list');
    this.$companyList = document.querySelector('.company-list');
  }

  render(id) {
    this.renderer.currResultId = id;
    this.renderer.$search.focus();
    this.release = this.store._.releases[id];
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
      let ids = this.store.categorized.label[label.name];
      if (ids)
        this.renderList(this.$labelList, label.name, ids, true, used, 'Label');
    });
    this.$companyList.innerHTML = '';
    Object.values(this.release.companies).forEach(company => {
      let companyRole = `${company.type}-${company.name}`,
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

  renderList($list, title, ids, includeArtist, used = [], listType = null) {
    let $ul,
      rendered = false;
    ids.forEach(id => {
      if (!used.includes(id)) {
        if (!rendered) {
          let $p = document.createElement('p');
          $p.innerHTML = listType ? `${listType}: ${title}` : title;
          $list.appendChild($p);
          $ul = document.createElement('ul');
          $list.appendChild($ul);
          rendered = true;
        }
        let release = this.store._.releases[id],
          $li = document.createElement('li'),
          $a = document.createElement('a');
        $a.setAttribute('href', '#');
        $li.appendChild($a);
        $a.addEventListener('click', e => {
          e.preventDefault();
          this.render(release.id);
        });
        let year = release.year > 1900 ? release.year : '',
          image = release.images ? release.images[0] : null;
        if (image)
          $a.innerHTML += `<div class="image" style="background-image: url('${image.uri}')"></div>`;
        else $a.innerHTML += `<div class="image"></div>`;
        if (includeArtist) {
          let artist = Object.values(release.artists)
            .map(a => a.name)
            .join(', ');
          title = release.title;
          artist = this.truncatedString(artist);
          title = this.truncatedString(title);
          $a.innerHTML += `<div><span><span>${title}</span><span>${year}</span></span><span>${artist}</span></div>`;
        } else {
          let title = release.title;
          title = this.truncatedString(title);
          $a.innerHTML += `<div><span><span>${title}</span><span>${year}</span></span></div>`;
        }
        $ul.appendChild($li);
      }
    });
  }

  truncatedString(string) {
    if (string.length <= 27) return string;
    return `${string.substring(0, 27).replace(/ +$/, '')}…`;
  }
}
