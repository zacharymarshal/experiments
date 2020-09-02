const template = document.createElement('template');
template.innerHTML = `
<style>
:host {
  color: blue;
}
:host(.clicked) {
  color: purple;
}
.btn {
  border: 1px solid orange;
  padding: 5px 10px;
}
div {
  padding: inherit;
}
</style>

<div id="hello">Hello world!</div>
<button class="btn">Button!</button>
`;

class FilterBoxElement extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.addEventListener('click', this._onClick);
  }
  connectedCallback() {
    const undefinedFilters = this.querySelectorAll('the-filter:not(:defined)');
    const promises = [...undefinedFilters].map(filter => {
      return window.customElements.whenDefined(filter.localName);
    });

    Promise.all(promises).then(() => {
      console.log('Children are ready!');
      [...this.querySelectorAll('the-filter')].map(filter => {
        filter.hello();
      });
    });
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._onClick);
  }

  _onClick(e) {
    this.classList.add('clicked');
    console.log('Clicked!!');
  }
}

export { FilterBoxElement };
