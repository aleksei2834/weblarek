import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IOrder {
  selectedButton: HTMLButtonElement,
  address: string
}

export class Order extends Component<IOrder> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;
  
  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.paymentButtons = ensureAllElements('.button_alt', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('.form__input', this.container);

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.events.emit('button:selected', {selectedButton: button.name});
      })
    })

  }

  set selectedButton (button: HTMLButtonElement) {
    button.classList.toggle('button_alt-active')
  }

  set address(value: string) {
    this.addressInput.textContent = value;
  }
}