import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccess {
  price: number;
}

export class Success extends Component<ISuccess> {
  protected orderDescription: HTMLElement;
  protected successClose: HTMLButtonElement;

  constructor(protected events: IEvents, protected container: HTMLElement) {
    super(container);

    this.orderDescription = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.successClose = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.successClose.addEventListener('click', () => {
      this.events.emit('success:close');
    })
  }

  set price(value: number) {
    this.orderDescription.textContent = `Списано ${value} синапсов`
  }
}