import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

interface IOrder {
  selectedButton: HTMLButtonElement,
  address: string
}

export class Order extends Form<IOrder> {
  public paymentButtons: HTMLButtonElement[];
  public addressInput: HTMLInputElement;
  
  constructor(protected events: IEvents, container: HTMLElement) {
    super(events, container);

    this.paymentButtons = ensureAllElements('.button_alt', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('.form__input', this.container);

    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.events.emit('button:selected', {selectedButton: button.name});
      })
    })

    this.addressInput.addEventListener('input', () => {
      events.emit('address:input', {address: this.addressInput.value});
    })

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      events.emit('modal:open-contacts');
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