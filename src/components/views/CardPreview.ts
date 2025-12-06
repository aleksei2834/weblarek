import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

interface ICardPreview {
  category: string,
  image: string,
  text: string,
  button: 'Купить' | 'Удалить из корзины' | 'Недоступно' 
}

export class CardPreview extends Card<ICardPreview> {
  protected cardImage: HTMLImageElement;
  protected cardCategory: HTMLElement;
  protected cardText: HTMLElement;
  protected cardButton: HTMLButtonElement;
  
  constructor(protected events: IEvents, protected container: HTMLElement) {
    super(container);

    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this.cardText = ensureElement<HTMLElement>('.card__text', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.cardButton.addEventListener('click', () => {
      this.events.emit('card:basket');
    })
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
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

  disableButton(): void {
    this.cardButton.disabled = true;
  }
}