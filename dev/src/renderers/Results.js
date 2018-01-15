export default class Results {
  constructor(renderer) {
    this.renderer = renderer;
    this.store = renderer.store;
    this.$container = document.querySelector('#results');
  }

  setCurrent(id, adder) {
    let $curr = this.$container.querySelector('li.selected');
    if ($curr) $curr.classList.remove('selected');
    if (id) {
      let $el = this.$container.querySelector(`li.release-${id}`);
      $el.classList.add('selected');
      $el.scrollIntoView();
    }
  }

  render(results) {
    this.currResultIdx = -1;
    this.$container.innerHTML = '';
    if (!results) return;
    let max = Math.min(30, results.length);
    for (let i = 0; i < max; i++) {
      let result = results[i],
        $li = document.createElement('li'),
        $a = document.createElement('a');
      this.renderer.resultIds.push(result.item.id);
      $li.classList.add(`release-${result.item.id}`);
      $a.innerHTML = this.renderResult(result);
      $a.setAttribute('href', '#');
      $a.setAttribute('tabindex', '-1');
      $a.addEventListener('click', e => {
        e.preventDefault();
        $a.blur();
        this.renderer.$search.focus();
        this.renderer.handleItemClick(i);
      });
      $li.appendChild($a);
      this.$container.appendChild($li);
    }
  }

  renderResult(result, type) {
    let matches = {};
    result.matches.forEach(match => {
      matches[match.key] = this.renderMatch(match);
    });
    let release = this.store._.releases[result.item.id],
      image = release.images ? release.images[0] : null,
      html;
    if (image)
      html = `<div class="image" style="background-image: url('${image.uri}')"></div>`;
    else html = `<div class="image"></div>`;
    html += `
      <div class="title">`;
    if (matches.artistTitle) html += matches.artistTitle;
    else html += `${result.item.artist}: ${result.item.title}`;
    html += `
        ${result.item.year > 1900 ? `(${result.item.year})` : ''}
      </div>
      <div class="format">
        ${result.item.format}
      </div>`;
    return html;
  }

  renderMatch(match) {
    let value = match.value,
      starts = match.indices.map(i => i[0]),
      stops = match.indices.map(i => i[1]),
      useStart = true;
    let string = '';
    value.split('').forEach((char, i) => {
      if (useStart) {
        if (starts[0] !== undefined && starts[0] === i) {
          if (starts[0] === stops[0]) {
            string += `<span>${char}</span>`;
            stops.shift();
          } else {
            string += `<span>${char}`;
            useStart = false;
          }
          starts.shift();
        } else {
          string += char;
        }
      } else {
        if (stops[0] !== undefined && stops[0] === i) {
          string += `${char}</span>`;
          stops.shift();
          useStart = true;
        } else {
          string += char;
        }
      }
    });

    return string;
  }
}
