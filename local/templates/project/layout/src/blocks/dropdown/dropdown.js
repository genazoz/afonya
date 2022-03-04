const nope = () => {
}

export class Dropdown {
  constructor(el, options) {
    this.$el = el
    this.options = options

    this.#setup();
  }

  #setup() {
    this.$el.classList.contains('dropdown') ? nope() : this.$el.classList.add('dropdown')
    this.clickHandler = this.clickHandler.bind(this)
    document.querySelector('body').addEventListener('click', this.clickHandler)
    this.$arrow = this.$el.querySelector('[data-type="dropdown-ico"]')
  }

  clickHandler(event) {
    this.toggle(event);
  }

  get isOpen() {
    return this.$el.classList.contains('is-open');
  }

  toggle(event) {
    if (this.isOpen) {
      event.target !== this.$el && !this.$el.contains(event.target) || event.target == this.$el.querySelector('[data-type="dropdown-header"]')
        ? this.close()
        : nope()
    } else {
      event.target == this.$el.querySelector('[data-type="dropdown-header"]')
        ? this.open()
        : nope();
    }

    if(this.$el.classList.contains('dropdown--filter')) {
      this.$el.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (event.target === checkbox) {
          let inputCount = this.$el.querySelectorAll('input[type="checkbox"]:checked').length;

          inputCount > 0 ? this.check() : this.uncheck();
        }
      })
      if(event.target === this.$el.querySelector('.dropdown__header-button')) {
        this.uncheckCheckboxes(this.$el.querySelectorAll('input[type="checkbox"]:checked'));
      }
    }
  }

  open() {
    this.$el.classList.add('is-open')
    this.$arrow.classList.add('is-open')
  }

  close() {
    this.$el.classList.remove('is-open')
    this.$arrow.classList.remove('is-open')
  }

  check() {
    this.$el.classList.add('is-checked')
  }

  uncheck() {
    this.$el.classList.remove('is-checked')
  }

  uncheckCheckboxes(checkboxes) {
    [...checkboxes].forEach(checkbox => checkbox.checked = false)
    this.uncheck();
  }

  destroy() {
    this.$el.removeEventListener('click', this.clickHandler)
  }
}
