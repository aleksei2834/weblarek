import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IOrder {
  selectedButton: HTMLButtonElement,
  address: string
}

export class Order extends Component<IOrder> {
  public paymentButtons: HTMLButtonElement[];
  public addressInput: HTMLInputElement;
  
  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.paymentButtons = ensureAllElements('.button_alt', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('.form__input', this.container);

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.events.emit('button:selected', {selectedButton: button.name});
      })
    })

    this.addressInput.addEventListener('input', () => {
      events.emit('address:input');
    })
  }

  set selectedButton (button: HTMLButtonElement) {
    // Снимаем активный класс со всех кнопок
  this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));

  // Добавляем активный класс только если его ещё нет
  if (!button.classList.contains('button_alt-active')) {
    button.classList.add('button_alt-active');
  }
  }

  set address(value: string) {
    this.addressInput.textContent = value;
  }

}