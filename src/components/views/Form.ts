import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component"
import { IEvents } from "../base/Events"

interface IErrors {
  payment: 'cash' | 'card',
  address: string,
  email: string,
  phone: string
}

interface IForm {
  errors: IErrors
} 

export class Form extends Component<IForm> {
  protected formErrors: HTMLElement;
  protected formButton: HTMLButtonElement;

  constructor(protected events: IEvents, protected container: HTMLElement) {
    super(container);

    this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
    this.formButton = ensureElement<HTMLButtonElement>('.order__button', this.container);
  }

  set errors(error: string) {
    this.formErrors.textContent = error;
  }

  set valid(isValid: boolean) {
    if (isValid) {
      this.formButton.disabled = false;
    } else this.formButton.disabled = true;
  }
}