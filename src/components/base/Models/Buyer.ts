import { TPayment, IBuyer, IBuyerErrors } from "../../../types";
import { IEvents } from "../Events";

export class Buyer implements IBuyer {
  protected _payment: TPayment | null;
  protected _address: string;
  protected _phone: string;
  protected _email: string;

  constructor(protected events: IEvents) {
    this._payment = null;
    this._address = "";
    this._phone = "";
    this._email = "";
  }

  set phone(phone: string) {
    this._phone = phone;
  }

  set payment(payment: TPayment) {
    this._payment = payment;
    this.events.emit('payment:selected')
  }

  set email(email: string) {
    this._email = email;
  }

  set address(address: string) {
    this._address = address;
  }

  get buyer(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  replace(): void {
    this._address = "";
    this._email = "";
    this._payment = null;
    this._phone = "";
  }

  validation(): IBuyerErrors {
    const buyerErrors: IBuyerErrors = {
      payment: undefined,
      email: undefined,
      phone: undefined,
      address: undefined,
    };

    if (this._payment === null) {
      buyerErrors.payment = "Выберите тип оплаты";
    }
    if (this._email.trim() === "") {
      buyerErrors.email = "Введите ваш E-mail";
    }
    if (this._phone.trim() === "") {
      buyerErrors.phone = "Введите номер телефона";
    }
    if (this._address.trim() === "") {
      buyerErrors.address = "Укажите адрес";
    }
    return buyerErrors;
  }
}
