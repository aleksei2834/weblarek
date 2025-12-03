import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card"

interface ICardBasket {
  index: number
}

export class CardBasket extends Card<ICardBasket> {
  protected cardIndex: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.cardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    this.deleteButton.addEventListener('click', () => {
      this.events.emit('card:delete')
    })
  }

  set index(value: number) {
    this.cardIndex.textContent = String(value);
  }
}