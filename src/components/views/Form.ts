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
  errors: IErrors,
  valid: boolean
} 

export class Form<T> extends Component<IForm & T> {
  protected formErrors: HTMLElement;
  public formButton: HTMLButtonElement;

  constructor(protected events: IEvents, protected container: HTMLElement) {
    super(container);

    this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
    this.formButton = ensureElement<HTMLButtonElement>('.button[type="submit"]', this.container);

  }

  set errors(error: string) {
    this.formErrors.textContent = error;
  }

  set valid(isValid: boolean) {
    this.formButton.disabled = !isValid;
  }
}