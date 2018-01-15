export default class View {
  constructor(renderer) {
    this.renderer = renderer;
    this.store = renderer.store;
    this.$container = document.querySelector('#overlay');
    this.$h1 = this.$container.querySelector('h1');
    this.$image = this.$container.querySelector('.image');
    this.$title = this.$container.querySelector('.title');
    this.$artist = this.$container.querySelector('.artist');
    this.$meta = this.$container.querySelector('.meta');
    this.$close = this.$container.querySelector('#close');
    this.$updateSpotify = this.$container.querySelector('.update-spotify');
    this.$close.addEventListener('click', () => {
      this.renderer.handleEscape();
    });
    this.$companies = this.$container.querySelector('.companies');
    this.$tracklist = this.$container.querySelector('.tracklist ul');
    this.$spotify = this.$container.querySelector('.tracklist .spotify-frame');
    if (this.store.app.masterUser) this.initializeSpotifyForm();
  }

  hide() {
    this.$container.classList.add('hide');
    this.renderer.$search.focus();
  }

  show() {
    this.$container.classList.remove('hide');
    this.$tracklist.focus();
  }

  render(release) {
    this.releaseId = release.id;
    this.release = release;
    this.collectionRelease = this.store._.collectionReleases[release.id];
    this.renderImage();
    this.renderTitle();
    this.renderArtist();
    this.renderMeta();
    this.renderCompanies();
    this.renderTracklist();
    if (this.store.app.masterUser) this.renderSpotifyForm();
  }

  renderImage() {
    let { images } = this.release;
    let image = images[0];
    if (image) this.$image.style.backgroundImage = `url('${image.uri}')`;
    else this.$image.style.backgroundImage = `none`;
  }

  renderTitle() {
    let { title, id } = this.release;
    this.$title.innerHTML = `<a href="https://www.discogs.com/release/${id}" target="blank">
      ${title.replace(/ ([^ ]+)$/, '&nbsp;$1')}
    </a>`;
    this.$h1.innerHTML = title;
  }

  renderArtist() {
    let { artists, year } = this.release;
    year = year > 1900 ? `,&nbsp;${year}` : '';
    this.$artist.innerHTML =
      Object.values(artists)
        .map(
          ({ id, name }) =>
            `<span><a href="https://www.discogs.com/artist/${id}" target="blank">${name}</a></span>`
        )
        .join(', ') + year;
  }

  renderMeta() {
    let { formats, labels } = this.release,
      { added, folderId } = this.collectionRelease;
    this.$meta.innerHTML = '';
    labels = Object.values(labels)
      .map(
        label =>
          `<span>
            <a href="https://www.discogs.com/label/${label.id}" target="blank">
            ${label.name
              .split(' ')
              .join('&nbsp;')}</a>&nbsp;${label.catno}</span>`
      )
      .join(', ');
    this.$meta.innerHTML += `<p class="label">${labels}</p>`;

    let formatTypes = {};
    this.$meta.innerHTML += `<p class="format">${formats
      .map(format => {
        if (formatTypes[format.name]) return '';
        formatTypes[format.name] = 1;
        return `<span>${format.name} (${format.quantity})</span>`;
      })
      .join('')}</p>`;

    let folder = this.store._.collectionFolders[folderId].name,
      date = this.renderDateFromEpoch(added);
    this.$meta.innerHTML += `<p class="folder"><strong>${folder}</strong> ${date}</p>`;
  }

  renderCompanies() {
    let { companies } = this.release;
    this.$companies.innerHTML = '';
    companies = Object.values(companies)
      .map(
        ({ name, id, type }) =>
          `<span>
            ${type}:
            <a href="https://www.discogs.com/label/${id}" target="blank">
            ${name.split(' ').join('&nbsp;')}</a></span>`
      )
      .join('<br>');
    this.$companies.innerHTML += `<p class="label">${companies}</p>`;
  }

  initializeSpotifyForm() {
    this.$updateSpotify.classList.remove('hide');
    this.$spotifyId = this.$updateSpotify.querySelector('input');
    this.$spotifySubmit = this.$updateSpotify.querySelector('button');
    this.$spotifySubmit.addEventListener('click', () => {
      this.renderer.loading.enable();
      this.renderer.loading.message('Updating Spotify Id');
      this.store
        .updateSpotifyId(this.releaseId, this.$spotifyId.value)
        .then(() => {
          this.renderer.loading.disable();
          this.renderTracklist();
        });
    });
  }

  renderSpotifyForm() {
    let spotify = this.store._.spotify[this.releaseId];
    if (spotify !== undefined) this.$spotifyId.value = spotify.id;
    else this.$spotifyId.value = '';
  }

  renderTracklist() {
    let release = this.store._.releases[this.releaseId];
    let { tracklist, artists, title } = release;
    let releaseId = release.id;
    this.$tracklist.innerHTML = '';
    this.$spotify.innerHTML = '';
    let spotify = this.store._.spotify && this.store._.spotify[release.id];
    if (spotify && spotify.id !== '') {
      this.$spotify.innerHTML = `<iframe src="https://open.spotify.com/embed/album/${spotify.id}"
          width="300" height="380" frameborder="0" allowtransparency="true"></iframe>`;
      this.$spotify.classList.remove('hide');
    }

    tracklist.forEach(track => {
      let $li = document.createElement('li'),
        title = track.title.replace(/ ([^ ]+)$/, '&nbsp;$1');
      $li.classList.add(track.type);
      $li.innerHTML = `<span>${track.position}</span><span>${title}</span>`;
      this.$tracklist.appendChild($li);
    });
  }

  truncatedString(string) {
    if (string.length <= 75) return string;
    return `${string.substring(0, 75).replace(/ +$/, '')}…`;
  }

  renderDateFromEpoch(epoch, includeDay = false) {
    let date = new Date(epoch),
      monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      year = date.getFullYear(),
      month = monthNames[date.getMonth()],
      day = date.getDate();
    if (includeDay) return `${month} ${day}, ${year}`;
    else return `${month} ${year}`;
  }
}
