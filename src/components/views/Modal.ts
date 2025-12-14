import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
  content: HTMLElement
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected modalContent: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);

    // Закрытие модального окна по клику на кнопку закрытия
    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    });
    // Закрытие модального окна по клику вне контента
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.events.emit('modal:close');
      }
    });
  }

  set content(content: HTMLElement) { 
    const modalContent = ensureElement('.modal__content', this.container);
    modalContent.innerHTML = ''
    modalContent.append(content);
  }

  open(): void {
    this.container.classList.add('modal_active')
  }

  close(): void {
    this.container.classList.remove('modal_active')
  }
}