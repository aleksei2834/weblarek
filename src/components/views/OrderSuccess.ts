import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IOrderSuccess {
  totalSum: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected buttonSubmit: HTMLButtonElement;
  protected fullPrice: HTMLElement;

  constructor( protected events: IEvents, protected  container: HTMLElement) {
    super(container);

    this.buttonSubmit = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.fullPrice = ensureElement<HTMLElement>('.order-success__description', this.container);

    this.buttonSubmit.addEventListener('click', () => {
      events.emit('button:success')
    })
  }

  set totalSum(value:number) {
    this.fullPrice.textContent = `Списано ${value} синапсов`
  }

}
