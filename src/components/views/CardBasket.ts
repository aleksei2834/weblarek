import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card"
import { ICardActions } from "./CardCatalog";

interface ICardBasket {
  index: number
}

export class CardBasket extends Card<ICardBasket> {
  protected cardIndex: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected actions: ICardActions) {
    super(container);

    this.cardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', actions.onClick)
  }

  set index(value: number) {
    this.cardIndex.textContent = String(value);
  }
}