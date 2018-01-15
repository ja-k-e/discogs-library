export default class Loading {
  constructor(renderer) {
    this.renderer = renderer;
    this.$container = document.querySelector('#loading');
    this.$container.classList.add('hide');
    this.$ul = this.$container.querySelector('ul');
  }

  enable() {
    this.$container.classList.remove('hide');
  }

  disable() {
    this.$container.classList.add('hide');
    this.$ul.innerHTML = '';
  }

  message(content) {
    let $li = document.createElement('li'),
      $last = this.$ul.querySelector('li:first-child');
    $li.innerHTML = content;
    if ($last) this.$ul.insertBefore($li, $last);
    else this.$ul.appendChild($li);
  }
}
