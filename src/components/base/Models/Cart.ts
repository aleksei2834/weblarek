import { IProduct } from "../../../types";

export class Cart {
  protected _products: IProduct[];

  constructor() {
    this._products = [];
  }

  add(product: IProduct): void {
    // Добавление товара в корзину
    this._products?.push(product);
  }

  delete(product: IProduct): void {
    // Удаление товара из корзины
    const index = this._products?.findIndex((item) => item == product); // Поиск индекс товара
    if (typeof index == "number") {
      // в массиве
      if (index !== -1) {
        this._products?.splice(index, 1); // Удаление товара по его индексу
      } else console.log("error"); // Если не найден - error
    }
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

  replace(): IProduct[] {
    return this._products?.splice(0, this._products.length);
  }
}
