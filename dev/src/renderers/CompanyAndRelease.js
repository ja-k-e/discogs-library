export default class Company {
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
          this.renderer.results.itemType = 'release';
          this.renderer.release.render(release.id);
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
