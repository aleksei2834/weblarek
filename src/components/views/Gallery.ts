import { Component } from "../base/Component"

interface IGallery {
  catalog: HTMLElement[]
}

export class Gallery extends Component<IGallery> {

  constructor(protected container: HTMLElement) {
    super(container);

    this.catalog = [];
  }

  set catalog(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}