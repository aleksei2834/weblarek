import { IProduct } from "../../../types";
import { IEvents } from "../Events";

export class Cart {
  protected _products: IProduct[];

  constructor(protected events: IEvents) {
    this._products = [];
  }

  add(product: IProduct): void {
    // Добавление товара в корзину
    if (product !== undefined) {
      this._products?.push(product);
    }
    this.events.emit('basket:changed');
  }

  delete(product: IProduct): void {

    this._products = this._products.filter(item => item.id !== product.id)
    this.events.emit('basket:changed');
  }

  total(): number {
    // Количество товаров в корзине
    return this._products?.length;
  }

  get products(): IProduct[] {
    // Получить весь список товаров в корзине
    return this._products;
  }

  totalSum(): number {
    let sum: number = 0; // Общая стоимость товаров в корзине

    this._products?.forEach((item: IProduct) => {
      if (typeof item.price == "number") {
        sum += item.price;
      }
    });
    return sum;
  }

  isAvailable(id: string): boolean {
    if (this._products?.find((item: IProduct) => item.id === id)) {
      return true;
    } else return false;
  }

  replace(): void {
    this._products?.splice(0, this._products.length);
    this.events.emit('basket:changed');
  }
}
