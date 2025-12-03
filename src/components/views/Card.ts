import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ICard {
  title: string,
  price: number,
}

export class Card<T> extends Component<ICard & T> {
  protected cardPrice: HTMLElement;
  protected cardTitle: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
  }

  set title(value: string) {
    this.cardTitle.textContent = value;
  }

  set price(value: number) {
    this.cardPrice.textContent = `${value} синапсов`;
  }
}