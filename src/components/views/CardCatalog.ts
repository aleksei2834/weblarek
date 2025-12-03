import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

interface ICardCatalog {
  category: string,
  image: string
}

export class CardCatalog extends Card<ICardCatalog> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);

    this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('card__image', this.container);
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
  }

  set image(value: string) {
    this.cardImage.src = value
  }
}