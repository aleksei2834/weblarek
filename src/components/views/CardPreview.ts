import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";
import { ICardActions } from "./CardCatalog";

interface ICardPreview {
  category: string,
  image: string,
  text: string,
  button: 'Купить' | 'Удалить из корзины' | 'Недоступно',
  description: string,
}

export class CardPreview extends Card<ICardPreview> {
  protected cardImage: HTMLImageElement;
  protected cardCategory: HTMLElement;
  protected cardText: HTMLElement;
  protected cardButton: HTMLButtonElement;
  protected cardDescription: HTMLElement;

  constructor(protected container: HTMLElement, protected actions: ICardActions) {
    super(container);

    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this.cardText = ensureElement<HTMLElement>('.card__text', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);

    this.cardButton.addEventListener('click', actions.onClick)
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    this.cardCategory.classList.toggle('card__category_other');
    this.cardCategory.classList.add(categoryMap[value]);
        
  }

  set image(value:string) {
    this.cardImage.src = value;
  }

  set text(value: string) {
    this.cardText.textContent = value;
  }

  set button(value: 'Купить' | 'Удалить из корзины' | 'Недоступно') {
    this.cardButton.textContent = value;
  }

  set description(value: string) {
    this.cardDescription.textContent = value;
  }

  disableButton(): void {
    this.cardButton.disabled = true;
  }
}