import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

interface IContacts {
  email: string;
  phone: string;
}

export class Contacts extends Form<IContacts> {
  public emailInput: HTMLInputElement;
  public phoneInput: HTMLInputElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(events, container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.emailInput.addEventListener('input', () => {
      events.emit('email:input', {email: this.emailInput.value})
    })

    this.phoneInput.addEventListener('input', () => {
      events.emit('phone:input', {phone: this.phoneInput.value})
    })

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      events.emit('button:pay');
    })
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}