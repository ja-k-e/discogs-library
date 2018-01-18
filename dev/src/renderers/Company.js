import CompanyAndRelease from './CompanyAndRelease';

export default class Company extends CompanyAndRelease {
  render(id) {
    this.renderer.currResultId = id;
    this.renderer.$search.focus();
    this.renderer.$updateRelease.setAttribute('disabled', true);
    this.company = this.store.companies[id];
    this.$image.classList.add('hide');
    this.$artist.classList.add('hide');
    this.$meta.classList.add('hide');
    this.$view.classList.add('hide');
    this.$artistList.classList.add('hide');
    this.$labelList.classList.add('hide');
    this.renderMain();
    this.renderLists();
  }

  renderLists() {
    this.$companyList.innerHTML = '';
    this.company.types.forEach(type => {
      let companyRole = `${type}-${this.company.id}`,
        ids = this.store.categorized.companies[companyRole];
      if (ids) {
        this.renderList(
          this.$companyList,
          this.company.name,
          ids,
          true,
          [],
          type
        );
      }
    });
  }

  renderMain() {
    this.$title.innerHTML = `<a href="https://www.discogs.com/label/${this
      .company.id}" target="blank">
      ${this.company.name.replace(/ ([^ ]+)$/, '&nbsp;$1')}
    </a>`;
  }
}
